import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import pb from '@/lib/pocketbaseClient';
import apiServerClient from '@/lib/apiServerClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, UploadCloud, Loader2, AlertCircle } from 'lucide-react';

const ApplicationFormPage = () => {
  // All hooks at the top
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [job, setJob] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Core Form State
  const [formData, setFormData] = useState({
    nombre: currentUser?.name?.split(' ')[0] || '',
    apellidos: currentUser?.name?.split(' ').slice(1).join(' ') || '',
    email: currentUser?.email || '',
    telefono: '',
    fecha_nacimiento: '',
    ciudad: '',
    provincia: '',
    nacionalidad: '',
    estudios: '',
    experiencia_laboral: '',
    disponibilidad_inmediata: false,
    carnet_conducir: false,
    vehiculo_propio: false,
    carta_presentacion: ''
  });

  const [file, setFile] = useState(null);
  const [questionAnswers, setQuestionAnswers] = useState({});
  const [workPermissionDenied, setWorkPermissionDenied] = useState(false);

  useEffect(() => {
    const fetchOfferAndQuestions = async () => {
      try {
        const record = await pb.collection('ofertas').getOne(id, { $autoCancel: false });
        setJob(record);

        const questionsRecords = await pb.collection('preguntas_cribado').getFullList({
          filter: `oferta_id="${id}"`,
          sort: 'orden',
          $autoCancel: false
        });
        
        // Ensure Permiso de Trabajo question is first if it exists
        const sortedQuestions = questionsRecords.sort((a, b) => {
          if (a.es_permiso_trabajo && !b.es_permiso_trabajo) return -1;
          if (!a.es_permiso_trabajo && b.es_permiso_trabajo) return 1;
          return a.orden - b.orden;
        });

        setQuestions(sortedQuestions);
      } catch (error) {
        toast.error("Oferta no encontrada.");
        navigate('/ofertas-de-trabajo');
      } finally {
        setLoading(false);
      }
    };
    fetchOfferAndQuestions();
  }, [id, navigate]);

  // Callbacks after hooks
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAnswerChange = (questionId, value, isWorkPermission = false) => {
    setQuestionAnswers(prev => ({ ...prev, [questionId]: value }));
    
    if (isWorkPermission && value === 'No') {
      setWorkPermissionDenied(true);
    } else if (isWorkPermission && value === 'Sí') {
      setWorkPermissionDenied(false);
    }
  };

  const handleCheckboxAnswerChange = (questionId, option, isChecked) => {
    setQuestionAnswers(prev => {
      const currentVal = prev[questionId] ? prev[questionId].split(', ') : [];
      if (isChecked) {
        return { ...prev, [questionId]: [...currentVal, option].join(', ') };
      } else {
        return { ...prev, [questionId]: currentVal.filter(v => v !== option).join(', ') };
      }
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("El archivo supera el límite de 5MB.");
        e.target.value = null;
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (workPermissionDenied) {
      toast.error("No cumples con el requisito de permiso de trabajo vigente.");
      return;
    }

    if (!file) {
      toast.error("Debes adjuntar tu currículum.");
      return;
    }

    // Validate Required Questions
    for (const q of questions) {
      if (q.obligatoria && (!questionAnswers[q.id] || questionAnswers[q.id].trim() === '')) {
        toast.error(`La pregunta "${q.pregunta}" es obligatoria.`);
        return;
      }
    }

    setSubmitting(true);

    try {
      // 1. Save Candidatura
      const submissionData = new FormData();
      submissionData.append('oferta_id', id);
      if (currentUser) submissionData.append('usuario_id', currentUser.id);
      Object.keys(formData).forEach(key => submissionData.append(key, formData[key]));
      submissionData.append('permiso_trabajo', !workPermissionDenied);
      submissionData.append('estado', 'Recibido');
      submissionData.append('curriculum', file);

      const createdCandidatura = await pb.collection('candidaturas').create(submissionData, { $autoCancel: false });

      // 2. Save Screening Answers
      for (const q of questions) {
        if (questionAnswers[q.id]) {
          await pb.collection('respuestas_cribado').create({
            candidatura_id: createdCandidatura.id,
            pregunta_id: q.id,
            respuesta: questionAnswers[q.id]
          }, { $autoCancel: false });
        }
      }

      // 3. Send Confirmation Email via API Server
      try {
        await apiServerClient.fetch('/email/confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            candidateName: `${formData.nombre} ${formData.apellidos}`,
            jobTitle: job.puesto || job.titulo,
            ofertaId: id
          })
        });
      } catch (emailError) {
        console.error("Non-critical error sending confirmation email", emailError);
      }

      navigate(`/ofertas-de-trabajo/${id}/confirmacion`, { 
        state: { candidatura: createdCandidatura, job } 
      });

    } catch (error) {
      console.error(error);
      if (error.data?.data?.email?.code === 'validation_not_unique' || error.message.includes('UNIQUE')) {
        toast.error("Ya te has inscrito a esta oferta anteriormente con este email.");
      } else {
        toast.error("Hubo un error al enviar tu candidatura. Inténtalo de nuevo.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Render logic after hooks
  if (loading) return <div className="min-h-screen pt-32 pb-24 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>;
  if (!job) return null;

  return (
    <div className="bg-muted/10 min-h-screen pt-28 pb-24">
      <Helmet>
        <title>Inscripción: {job.puesto || job.titulo} | FITJOB</title>
      </Helmet>

      <div className="container max-w-3xl">
        <Link to={`/ofertas-de-trabajo/${id}`} className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver a la oferta
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-foreground mb-2">Envía tu candidatura</h1>
          <p className="text-muted-foreground text-lg">
            Estás aplicando para: <span className="font-semibold text-foreground">{job.puesto || job.titulo}</span> en {job.empresa}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Section: Screening Questions */}
          {questions.length > 0 && (
            <div className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm">
              <h3 className="text-xl font-bold mb-6 border-b pb-4">Cuestionario Previo</h3>
              <div className="space-y-6">
                {questions.map((q) => (
                  <div key={q.id} className="space-y-3">
                    <Label className="text-base font-semibold leading-snug">
                      {q.pregunta} {q.obligatoria && <span className="text-destructive">*</span>}
                    </Label>
                    
                    {q.tipo === 'texto' && (
                      <Textarea 
                        required={q.obligatoria}
                        placeholder="Tu respuesta..."
                        value={questionAnswers[q.id] || ''}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        className="min-h-[80px]"
                      />
                    )}
                    
                    {q.tipo === 'numero' && (
                      <Input 
                        type="number"
                        required={q.obligatoria}
                        value={questionAnswers[q.id] || ''}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      />
                    )}

                    {q.tipo === 'fecha' && (
                      <Input 
                        type="date"
                        required={q.obligatoria}
                        value={questionAnswers[q.id] || ''}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      />
                    )}
                    
                    {q.tipo === 'si_no' && (
                      <RadioGroup 
                        required={q.obligatoria}
                        value={questionAnswers[q.id] || ''} 
                        onValueChange={(val) => handleAnswerChange(q.id, val, q.es_permiso_trabajo)}
                        className="flex space-x-6 pt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Sí" id={`${q.id}-si`} />
                          <Label htmlFor={`${q.id}-si`} className="font-normal cursor-pointer">Sí</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="No" id={`${q.id}-no`} />
                          <Label htmlFor={`${q.id}-no`} className="font-normal cursor-pointer">No</Label>
                        </div>
                      </RadioGroup>
                    )}

                    {q.tipo === 'seleccion_unica' && q.opciones && (
                      <RadioGroup 
                        required={q.obligatoria}
                        value={questionAnswers[q.id] || ''} 
                        onValueChange={(val) => handleAnswerChange(q.id, val)}
                        className="flex flex-col space-y-2 pt-2"
                      >
                        {q.opciones.split(',').map((opt, i) => {
                          const optionValue = opt.trim();
                          return (
                            <div key={i} className="flex items-center space-x-2">
                              <RadioGroupItem value={optionValue} id={`${q.id}-${i}`} />
                              <Label htmlFor={`${q.id}-${i}`} className="font-normal cursor-pointer">{optionValue}</Label>
                            </div>
                          )
                        })}
                      </RadioGroup>
                    )}

                    {q.tipo === 'lista' && q.opciones && (
                      <Select required={q.obligatoria} value={questionAnswers[q.id] || ''} onValueChange={(val) => handleAnswerChange(q.id, val)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una opción" />
                        </SelectTrigger>
                        <SelectContent>
                          {q.opciones.split(',').map((opt, i) => (
                            <SelectItem key={i} value={opt.trim()}>{opt.trim()}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {q.tipo === 'seleccion_multiple' && q.opciones && (
                      <div className="space-y-3 pt-2">
                        {q.opciones.split(',').map((opt, i) => {
                          const optionValue = opt.trim();
                          const isChecked = (questionAnswers[q.id] || '').includes(optionValue);
                          return (
                            <div key={i} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`${q.id}-${i}`} 
                                checked={isChecked}
                                onCheckedChange={(checked) => handleCheckboxAnswerChange(q.id, optionValue, checked)}
                              />
                              <Label htmlFor={`${q.id}-${i}`} className="font-normal cursor-pointer">{optionValue}</Label>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {workPermissionDenied && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start text-red-800">
                  <AlertCircle className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">Lamentablemente, en este momento solo podemos procesar candidaturas de personas con permiso de trabajo vigente en España. Gracias por tu interés.</p>
                </div>
              )}
            </div>
          )}

          {/* Render remaining form ONLY if work permission is not denied */}
          <div className={`space-y-8 transition-opacity duration-300 ${workPermissionDenied ? 'opacity-50 pointer-events-none' : ''}`}>
            
            <div className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm">
              <h3 className="text-xl font-bold mb-6 border-b pb-4">Datos Personales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2"><Label>Nombre *</Label><Input name="nombre" value={formData.nombre} onChange={handleInputChange} required /></div>
                <div className="space-y-2"><Label>Apellidos *</Label><Input name="apellidos" value={formData.apellidos} onChange={handleInputChange} required /></div>
                <div className="space-y-2"><Label>Email *</Label><Input type="email" name="email" value={formData.email} onChange={handleInputChange} required /></div>
                <div className="space-y-2"><Label>Teléfono *</Label><Input type="tel" name="telefono" value={formData.telefono} onChange={handleInputChange} required /></div>
                <div className="space-y-2"><Label>Fecha Nacimiento *</Label><Input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleInputChange} required /></div>
                <div className="space-y-2"><Label>Nacionalidad *</Label><Input name="nacionalidad" value={formData.nacionalidad} onChange={handleInputChange} required /></div>
                <div className="space-y-2"><Label>Ciudad *</Label><Input name="ciudad" value={formData.ciudad} onChange={handleInputChange} required /></div>
                <div className="space-y-2"><Label>Provincia *</Label><Input name="provincia" value={formData.provincia} onChange={handleInputChange} required /></div>
              </div>
            </div>

            <div className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm">
              <h3 className="text-xl font-bold mb-6 border-b pb-4">Educación y Experiencia</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Nivel de estudios *</Label>
                  <Select onValueChange={(val) => handleSelectChange('estudios', val)} value={formData.estudios} required>
                    <SelectTrigger><SelectValue placeholder="Selecciona un nivel" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sin estudios">Sin estudios</SelectItem>
                      <SelectItem value="Educación Secundaria (ESO)">Educación Secundaria (ESO)</SelectItem>
                      <SelectItem value="Bachillerato">Bachillerato</SelectItem>
                      <SelectItem value="Formación Profesional">Formación Profesional</SelectItem>
                      <SelectItem value="Grado Universitario">Grado Universitario</SelectItem>
                      <SelectItem value="Máster / Postgrado">Máster / Postgrado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Experiencia laboral resumida *</Label>
                  <Textarea name="experiencia_laboral" value={formData.experiencia_laboral} onChange={handleInputChange} required className="min-h-[100px]" />
                </div>
                <div className="space-y-4 pt-2">
                  <div className="flex items-center space-x-3"><Checkbox id="disp" name="disponibilidad_inmediata" checked={formData.disponibilidad_inmediata} onCheckedChange={(v) => handleSelectChange('disponibilidad_inmediata', v)} /><Label htmlFor="disp">Disponibilidad inmediata</Label></div>
                  <div className="flex items-center space-x-3"><Checkbox id="car" name="carnet_conducir" checked={formData.carnet_conducir} onCheckedChange={(v) => handleSelectChange('carnet_conducir', v)} /><Label htmlFor="car">Carnet de conducir</Label></div>
                  <div className="flex items-center space-x-3"><Checkbox id="veh" name="vehiculo_propio" checked={formData.vehiculo_propio} onCheckedChange={(v) => handleSelectChange('vehiculo_propio', v)} /><Label htmlFor="veh">Vehículo propio</Label></div>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm">
              <h3 className="text-xl font-bold mb-6 border-b pb-4">Documentos</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Currículum Vitae (PDF) *</Label>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-muted/50 transition-colors">
                    <UploadCloud className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm font-medium mb-1">Arrastra tu CV o haz clic para seleccionarlo</p>
                    <p className="text-xs text-muted-foreground mb-4">Solo PDF. Máx 5MB.</p>
                    <Input id="curriculum" type="file" accept=".pdf,application/pdf" onChange={handleFileChange} required className="hidden" />
                    <Button type="button" variant="outline" onClick={() => document.getElementById('curriculum').click()}>Seleccionar archivo</Button>
                    {file && <p className="mt-4 text-sm text-primary font-medium">Seleccionado: {file.name}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Carta de presentación (Opcional)</Label>
                  <Textarea name="carta_presentacion" value={formData.carta_presentacion} onChange={handleInputChange} className="min-h-[100px]" />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border">
              <Button type="submit" size="lg" className="w-full sm:w-2/3 h-14 text-lg font-bold rounded-xl" disabled={submitting || workPermissionDenied}>
                {submitting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Enviando...</> : 'Enviar candidatura'}
              </Button>
              <Button type="button" variant="outline" size="lg" className="w-full sm:w-1/3 h-14 font-semibold rounded-xl" onClick={() => navigate(`/ofertas-de-trabajo/${id}`)} disabled={submitting}>
                Cancelar
              </Button>
            </div>
            
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationFormPage;