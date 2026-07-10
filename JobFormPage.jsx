import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Loader2, Save, Plus, ArrowUp, ArrowDown, Edit, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import ScreeningQuestionsModal from '@/components/admin/ScreeningQuestionsModal.jsx';
import JobPreviewModal from '@/components/admin/JobPreviewModal.jsx';

const JobFormPage = () => {
  // 1. All hooks at the top level
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    titulo: '',
    puesto: '',
    empresa: '',
    descripcion: '',
    funciones: '',
    requisitos: '',
    beneficios: '',
    ciudad: '',
    provincia: '',
    modalidad: 'Presencial',
    tipo_contrato: 'indefinido',
    jornada: 'completa',
    sector: '',
    salario_minimo: '',
    salario_maximo: '',
    vacantes: 1,
    fecha_incorporacion: '',
    fecha_cierre: '',
    incorporacion_inmediata: false,
    destacada: false,
    urgente: false,
    estado: 'borrador'
  });

  const [questions, setQuestions] = useState([]);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [questionToEdit, setQuestionToEdit] = useState(null);

  useEffect(() => {
    if (isEditing) {
      const fetchJobAndQuestions = async () => {
        try {
          const record = await pb.collection('ofertas').getOne(id, { $autoCancel: false });
          setFormData({
            titulo: record.titulo || '',
            puesto: record.puesto || '',
            empresa: record.empresa || '',
            descripcion: record.descripcion || '',
            funciones: record.funciones || '',
            requisitos: record.requisitos || '',
            beneficios: record.beneficios || '',
            ciudad: record.ciudad || '',
            provincia: record.provincia || '',
            modalidad: record.modalidad || 'Presencial',
            tipo_contrato: record.tipo_contrato || 'indefinido',
            jornada: record.jornada || 'completa',
            sector: record.sector || '',
            salario_minimo: record.salario_minimo || '',
            salario_maximo: record.salario_maximo || '',
            vacantes: record.vacantes || 1,
            fecha_incorporacion: record.fecha_incorporacion?.split('T')[0] || '',
            fecha_cierre: record.fecha_cierre?.split('T')[0] || '',
            incorporacion_inmediata: record.incorporacion_inmediata || false,
            destacada: record.destacada || false,
            urgente: record.urgente || false,
            estado: record.estado || 'borrador'
          });

          const questionsRecords = await pb.collection('preguntas_cribado').getFullList({
            filter: `oferta_id="${id}"`,
            sort: 'orden',
            $autoCancel: false
          });
          setQuestions(questionsRecords);

        } catch (error) {
          toast.error('Error al cargar la oferta');
          navigate('/admin/ofertas');
        } finally {
          setLoading(false);
        }
      };
      fetchJobAndQuestions();
    }
  }, [id, isEditing, navigate]);

  // 2. Logic and callbacks after hooks
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (formData.descripcion.length < 100) {
      toast.error('La descripción debe tener al menos 100 caracteres.');
      return false;
    }
    if (formData.salario_minimo && formData.salario_maximo && Number(formData.salario_minimo) >= Number(formData.salario_maximo)) {
      toast.error('El salario mínimo debe ser menor que el salario máximo.');
      return false;
    }
    if (formData.vacantes < 1) {
      toast.error('Debe haber al menos 1 vacante.');
      return false;
    }
    
    const today = new Date().setHours(0,0,0,0);
    if (formData.fecha_incorporacion && new Date(formData.fecha_incorporacion).getTime() < today) {
      toast.error('La fecha de incorporación no puede ser en el pasado.');
      return false;
    }
    if (formData.fecha_cierre && new Date(formData.fecha_cierre).getTime() < today) {
      toast.error('La fecha límite de candidatura no puede ser en el pasado.');
      return false;
    }
    
    if (formData.fecha_incorporacion && formData.fecha_cierre) {
      if (new Date(formData.fecha_cierre).getTime() > new Date(formData.fecha_incorporacion).getTime()) {
        toast.error('La fecha límite no puede ser posterior a la fecha de incorporación.');
        return false;
      }
    }
    return true;
  };

  const saveToDatabase = async (createAnother = false) => {
    if (!validateForm()) return;
    setSubmitting(true);
    
    try {
      const payload = { ...formData };
      if (!payload.titulo && payload.puesto) payload.titulo = payload.puesto;
      if (payload.estado === 'publicada' && !isEditing) payload.fecha_publicacion = new Date().toISOString();
      
      // Ensure numerical values are proper numbers or null
      if (payload.salario_minimo === '') payload.salario_minimo = null;
      if (payload.salario_maximo === '') payload.salario_maximo = null;

      let savedOffer;
      if (isEditing) {
        savedOffer = await pb.collection('ofertas').update(id, payload, { $autoCancel: false });
        toast.success('Oferta actualizada correctamente');
      } else {
        payload.admin_id = pb.authStore.model.id;
        savedOffer = await pb.collection('ofertas').create(payload, { $autoCancel: false });
        toast.success('Oferta creada correctamente');
      }

      // Sync Questions
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const qPayload = { ...q, oferta_id: savedOffer.id, orden: i + 1 };
        if (q.id) {
          await pb.collection('preguntas_cribado').update(q.id, qPayload, { $autoCancel: false });
        } else {
          await pb.collection('preguntas_cribado').create(qPayload, { $autoCancel: false });
        }
      }

      if (createAnother) {
        navigate(0); // Refresh current route to reset
      } else {
        navigate('/admin/ofertas');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error al guardar la oferta: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveQuestion = (questionData) => {
    if (questionToEdit) {
      setQuestions(prev => prev.map(q => q.id === questionToEdit.id ? { ...questionData, id: q.id } : q));
    } else {
      setQuestions(prev => [...prev, { ...questionData, localId: Date.now() }]);
    }
  };

  const handleDeleteQuestion = async (index, question) => {
    if (window.confirm('¿Seguro que deseas eliminar esta pregunta?')) {
      if (question.id) {
        try {
          await pb.collection('preguntas_cribado').delete(question.id, { $autoCancel: false });
        } catch (err) {
          toast.error('Error al eliminar la pregunta de la base de datos');
          return;
        }
      }
      setQuestions(prev => prev.filter((_, i) => i !== index));
      toast.success('Pregunta eliminada');
    }
  };

  const moveQuestion = (index, direction) => {
    if ((direction === -1 && index === 0) || (direction === 1 && index === questions.length - 1)) return;
    const newQuestions = [...questions];
    const temp = newQuestions[index];
    newQuestions[index] = newQuestions[index + direction];
    newQuestions[index + direction] = temp;
    setQuestions(newQuestions);
  };

  // 3. Early returns after all hooks
  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="max-w-5xl mx-auto pb-24">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/ofertas')} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{isEditing ? 'Editar Oferta de Trabajo' : 'Crear Nueva Oferta'}</h1>
          <p className="text-muted-foreground mt-1">Completa las 7 secciones para configurar todos los detalles de la vacante.</p>
        </div>
      </div>

      <div className="space-y-8">
        
        {/* SECCIÓN 1: Información Básica */}
        <section className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm space-y-6">
          <h2 className="text-xl font-bold border-b pb-4 flex items-center">
            <span className="bg-primary/10 text-primary w-8 h-8 rounded-full inline-flex items-center justify-center mr-3 text-sm">1</span>
            Información Básica
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="puesto">Puesto / Título *</Label>
              <Input id="puesto" name="puesto" value={formData.puesto} onChange={handleChange} required placeholder="Ej. Desarrollador Frontend" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="empresa">Empresa *</Label>
              <Input id="empresa" name="empresa" value={formData.empresa} onChange={handleChange} required placeholder="Nombre de la empresa" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción * (Min. 100 caracteres)</Label>
            <Textarea 
              id="descripcion" 
              name="descripcion" 
              value={formData.descripcion} 
              onChange={handleChange} 
              required 
              className="min-h-[120px]" 
              placeholder="Describe detalladamente el puesto y la empresa..."
            />
            <div className="text-xs text-muted-foreground text-right">{formData.descripcion.length} caracteres</div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="funciones">Funciones</Label>
            <Textarea id="funciones" name="funciones" value={formData.funciones} onChange={handleChange} className="min-h-[100px]" placeholder="Responsabilidades clave del día a día..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="requisitos">Requisitos</Label>
            <Textarea id="requisitos" name="requisitos" value={formData.requisitos} onChange={handleChange} className="min-h-[100px]" placeholder="Experiencia, educación, habilidades blandas..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="beneficios">Beneficios</Label>
            <Textarea id="beneficios" name="beneficios" value={formData.beneficios} onChange={handleChange} className="min-h-[100px]" placeholder="Seguro médico, días libres, formación..." />
          </div>
        </section>

        {/* SECCIÓN 2: Ubicación */}
        <section className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm space-y-6">
          <h2 className="text-xl font-bold border-b pb-4 flex items-center">
            <span className="bg-primary/10 text-primary w-8 h-8 rounded-full inline-flex items-center justify-center mr-3 text-sm">2</span>
            Ubicación y Modalidad
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="ciudad">Ciudad *</Label>
              <Input id="ciudad" name="ciudad" value={formData.ciudad} onChange={handleChange} required placeholder="Ej. Madrid" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="provincia">Provincia *</Label>
              <Input id="provincia" name="provincia" value={formData.provincia} onChange={handleChange} required placeholder="Ej. Madrid" />
            </div>
          </div>
          <div className="space-y-3 pt-2">
            <Label>Modalidad *</Label>
            <RadioGroup value={formData.modalidad} onValueChange={(v) => handleRadioChange('modalidad', v)} className="flex flex-col sm:flex-row gap-4 sm:gap-8 pt-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Presencial" id="mod-presencial" />
                <Label htmlFor="mod-presencial" className="cursor-pointer font-normal">Presencial</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Remoto" id="mod-remoto" />
                <Label htmlFor="mod-remoto" className="cursor-pointer font-normal">Remoto (100%)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Híbrido" id="mod-hibrido" />
                <Label htmlFor="mod-hibrido" className="cursor-pointer font-normal">Híbrido</Label>
              </div>
            </RadioGroup>
          </div>
        </section>

        {/* SECCIÓN 3: Contrato */}
        <section className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm space-y-6">
          <h2 className="text-xl font-bold border-b pb-4 flex items-center">
            <span className="bg-primary/10 text-primary w-8 h-8 rounded-full inline-flex items-center justify-center mr-3 text-sm">3</span>
            Contrato
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Tipo de Contrato *</Label>
              <Select value={formData.tipo_contrato} onValueChange={(v) => handleSelectChange('tipo_contrato', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="indefinido">Indefinido</SelectItem>
                  <SelectItem value="temporal">Temporal</SelectItem>
                  <SelectItem value="prácticas">Prácticas</SelectItem>
                  <SelectItem value="autónomo">Autónomo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Jornada *</Label>
              <Select value={formData.jornada} onValueChange={(v) => handleSelectChange('jornada', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="completa">Completa</SelectItem>
                  <SelectItem value="media">Media Jornada</SelectItem>
                  <SelectItem value="por horas">Por Horas / Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sector</Label>
              <Select value={formData.sector} onValueChange={(v) => handleSelectChange('sector', v)}>
                <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tecnología">Tecnología / IT</SelectItem>
                  <SelectItem value="Marketing">Marketing / Publicidad</SelectItem>
                  <SelectItem value="Ventas">Ventas / Comercial</SelectItem>
                  <SelectItem value="Hostelería">Hostelería / Turismo</SelectItem>
                  <SelectItem value="Logística">Logística / Transporte</SelectItem>
                  <SelectItem value="Salud">Salud / Medicina</SelectItem>
                  <SelectItem value="Educación">Educación</SelectItem>
                  <SelectItem value="Administración">Administración</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* SECCIÓN 4: Salario y Vacantes */}
        <section className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm space-y-6">
          <h2 className="text-xl font-bold border-b pb-4 flex items-center">
            <span className="bg-primary/10 text-primary w-8 h-8 rounded-full inline-flex items-center justify-center mr-3 text-sm">4</span>
            Salario y Vacantes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="salario_minimo">Salario Mínimo Bruto/Año (€)</Label>
              <Input id="salario_minimo" type="number" name="salario_minimo" value={formData.salario_minimo} onChange={handleChange} placeholder="Ej. 24000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salario_maximo">Salario Máximo Bruto/Año (€)</Label>
              <Input id="salario_maximo" type="number" name="salario_maximo" value={formData.salario_maximo} onChange={handleChange} placeholder="Ej. 30000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vacantes">Número de Vacantes *</Label>
              <Input id="vacantes" type="number" name="vacantes" min="1" value={formData.vacantes} onChange={handleChange} required />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Si no deseas mostrar un rango salarial, deja ambos campos en blanco.</p>
        </section>

        {/* SECCIÓN 5: Fechas */}
        <section className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm space-y-6">
          <h2 className="text-xl font-bold border-b pb-4 flex items-center">
            <span className="bg-primary/10 text-primary w-8 h-8 rounded-full inline-flex items-center justify-center mr-3 text-sm">5</span>
            Fechas Clave
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fecha_incorporacion">Fecha de incorporación prevista *</Label>
              <Input id="fecha_incorporacion" type="date" name="fecha_incorporacion" value={formData.fecha_incorporacion} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fecha_cierre">Fecha límite de recepción de CVs *</Label>
              <Input id="fecha_cierre" type="date" name="fecha_cierre" value={formData.fecha_cierre} onChange={handleChange} required />
            </div>
          </div>
        </section>

        {/* SECCIÓN 6: Opciones de Visibilidad */}
        <section className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm space-y-6">
          <h2 className="text-xl font-bold border-b pb-4 flex items-center">
            <span className="bg-primary/10 text-primary w-8 h-8 rounded-full inline-flex items-center justify-center mr-3 text-sm">6</span>
            Opciones y Visibilidad
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Label className="block mb-2">Etiquetas Especiales</Label>
              <div className="flex items-center space-x-3">
                <Checkbox id="incorporacion_inmediata" name="incorporacion_inmediata" checked={formData.incorporacion_inmediata} onCheckedChange={(v) => handleSelectChange('incorporacion_inmediata', v)} />
                <Label htmlFor="incorporacion_inmediata" className="cursor-pointer font-normal">Incorporación inmediata requerida</Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox id="destacada" name="destacada" checked={formData.destacada} onCheckedChange={(v) => handleSelectChange('destacada', v)} />
                <Label htmlFor="destacada" className="cursor-pointer font-normal text-purple-700">Oferta Destacada (Mayor visibilidad)</Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox id="urgente" name="urgente" checked={formData.urgente} onCheckedChange={(v) => handleSelectChange('urgente', v)} />
                <Label htmlFor="urgente" className="cursor-pointer font-normal text-destructive">Proceso Urgente</Label>
              </div>
            </div>
            
            <div className="space-y-4">
              <Label className="block mb-2">Estado de Publicación *</Label>
              <RadioGroup value={formData.estado} onValueChange={(v) => handleRadioChange('estado', v)} className="flex flex-col gap-3">
                <div className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="publicada" id="est-publicada" />
                  <Label htmlFor="est-publicada" className="cursor-pointer font-medium text-green-700">Publicada (Visible para candidatos)</Label>
                </div>
                <div className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="borrador" id="est-borrador" />
                  <Label htmlFor="est-borrador" className="cursor-pointer font-medium text-slate-600">Borrador (Solo visible para ti)</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </section>

        {/* SECCIÓN 7: Preguntas de Cribado */}
        <section className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
            <h2 className="text-xl font-bold flex items-center">
              <span className="bg-primary/10 text-primary w-8 h-8 rounded-full inline-flex items-center justify-center mr-3 text-sm">7</span>
              Preguntas de Cribado
            </h2>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => { setQuestionToEdit(null); setIsQuestionModalOpen(true); }}
              className="text-primary border-primary/20 hover:bg-primary/10"
            >
              <Plus className="w-4 h-4 mr-2" /> Añadir pregunta
            </Button>
          </div>

          <div className="space-y-3">
            {questions.length === 0 ? (
              <div className="text-center py-8 bg-muted/50 rounded-xl border border-dashed border-border">
                <p className="text-muted-foreground">No has añadido preguntas de cribado.</p>
                <p className="text-sm text-muted-foreground mt-1">Las preguntas ayudan a filtrar candidatos automáticamente.</p>
              </div>
            ) : (
              questions.map((q, index) => (
                <div key={q.id || q.localId} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted/30 border border-border rounded-xl gap-4 hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-foreground">{index + 1}. {q.pregunta}</span>
                      {q.obligatoria && <span className="text-[10px] uppercase tracking-wider bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">Obligatoria</span>}
                      {q.es_permiso_trabajo && <span className="text-[10px] uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">Legal</span>}
                    </div>
                    <div className="text-xs text-muted-foreground flex gap-4">
                      <span>Tipo: <span className="font-medium capitalize">{q.tipo.replace('_', ' ')}</span></span>
                      {q.respuesta_descarte && <span>Descarte si: <span className="font-medium text-destructive">{q.respuesta_descarte}</span></span>}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 shrink-0">
                    <Button type="button" variant="ghost" size="icon" onClick={() => moveQuestion(index, -1)} disabled={index === 0} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" onClick={() => moveQuestion(index, 1)} disabled={index === questions.length - 1} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    <div className="w-px h-6 bg-border mx-1" />
                    <Button type="button" variant="ghost" size="icon" onClick={() => { setQuestionToEdit(q); setIsQuestionModalOpen(true); }} className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" onClick={() => handleDeleteQuestion(index, q)} className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Sticky Action Footer */}
        <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-background/95 backdrop-blur border-t p-4 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex space-x-3 w-full sm:w-auto">
              <Button type="button" variant="outline" onClick={() => navigate('/admin/ofertas')} className="flex-1 sm:flex-none">
                Cancelar
              </Button>
              <Button type="button" variant="secondary" onClick={() => setIsPreviewOpen(true)} className="flex-1 sm:flex-none">
                <Eye className="w-4 h-4 mr-2" /> Vista previa
              </Button>
            </div>
            <div className="flex space-x-3 w-full sm:w-auto">
              <Button 
                type="button" 
                onClick={() => saveToDatabase(false)} 
                disabled={submitting} 
                className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white font-semibold"
              >
                {submitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                Guardar Oferta
              </Button>
              <Button 
                type="button" 
                onClick={() => saveToDatabase(true)} 
                disabled={submitting} 
                className="flex-1 sm:flex-none bg-emerald-700 hover:bg-emerald-800 text-white font-semibold hidden md:flex"
              >
                {submitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
                Guardar y crear otra
              </Button>
            </div>
          </div>
        </div>
        <div className="h-10"></div> {/* Spacer for fixed footer */}

      </div>

      <ScreeningQuestionsModal 
        isOpen={isQuestionModalOpen} 
        onClose={() => setIsQuestionModalOpen(false)} 
        initialData={questionToEdit}
        onSave={handleSaveQuestion}
      />

      <JobPreviewModal 
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        formData={formData}
        questions={questions}
      />
    </div>
  );
};

export default JobFormPage;