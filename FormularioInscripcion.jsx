import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, UploadCloud, AlertCircle, FileText, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useFormValidation } from '@/hooks/useFormValidation.js';
import { useAutoSave } from '@/hooks/useAutoSave.js';

const PASOS = ['Datos Personales', 'Documentos', 'Preguntas'];

const FormularioInscripcion = () => {
  const { ofertaId } = useParams();
  const navigate = useNavigate();
  const { validateEmail, validatePhone, validateAge, validateFile } = useFormValidation();
  
  const [pasoActual, setPasoActual] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileError, setFileError] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    nombre: '', apellidos: '', dni_nie: '', email: '', telefono: '', fecha_nacimiento: '', ciudad: '', provincia: '', nacionalidad: '', estudios: '', anos_experiencia: '',
    disponibilidad_inmediata: false, carnet_conducir: false, vehiculo_propio: false,
    cv_file: null, cv_name: '', carta_name: '',
    permiso_trabajo: '',
    preguntas: {},
    policy_accepted: false
  });

  // Setup auto-save
  useAutoSave(`inscripcion_${ofertaId}`, formData);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.valid) {
      setFileError(validation.error);
      return;
    }

    setFileError('');
    setFormData(prev => ({
      ...prev,
      [`${field}_file`]: file,
      [`${field}_name`]: file.name
    }));
  };

  const validatePaso1 = () => {
    if (!formData.nombre || !formData.apellidos || !formData.dni_nie || !formData.email || !formData.telefono || !formData.fecha_nacimiento || !formData.ciudad) {
      toast.error('Por favor completa todos los campos requeridos (*)');
      return false;
    }
    if (!validateEmail(formData.email)) {
      toast.error('El email no es válido');
      return false;
    }
    if (!validatePhone(formData.telefono)) {
      toast.error('El teléfono no es válido (9-15 dígitos)');
      return false;
    }
    if (!validateAge(formData.fecha_nacimiento)) {
      toast.error('Debes ser mayor de 16 años para inscribirte');
      return false;
    }
    if (Number(formData.anos_experiencia) < 0) {
      toast.error('Los años de experiencia no pueden ser negativos');
      return false;
    }
    return true;
  };

  const validatePaso2 = () => {
    if (!formData.cv_name) {
      toast.error('Es obligatorio adjuntar tu CV');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (formData.permiso_trabajo !== 'Sí') {
      toast.error('No cumples el requisito de permiso de trabajo.');
      return;
    }
    if (!formData.policy_accepted) {
      toast.error('Debes aceptar la política de privacidad.');
      return;
    }

    setIsSubmitting(true);
    // Simulate API submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Inscripción enviada correctamente');
      localStorage.removeItem(`inscripcion_${ofertaId}`);
      navigate('/candidato/mis-candidaturas');
    }, 1500);
  };

  const nextStep = () => {
    if (pasoActual === 1 && !validatePaso1()) return;
    if (pasoActual === 2 && !validatePaso2()) return;
    setPasoActual(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => setPasoActual(prev => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link to={`/ofertas/${ofertaId}`} className="text-sm font-medium text-slate-500 hover:text-primary mb-4 inline-block">
            Cancelar inscripción
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900">Inscripción a la oferta</h1>
        </div>

        {/* Barra Progreso */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8">
          <div className="flex items-center justify-between mb-4">
            {PASOS.map((paso, index) => (
              <div key={paso} className="flex flex-col items-center gap-2 w-1/3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                  pasoActual > index + 1 ? 'bg-primary text-white' : 
                  pasoActual === index + 1 ? 'bg-primary text-white ring-4 ring-primary/20' : 'bg-slate-100 text-slate-400'
                }`}>
                  {pasoActual > index + 1 ? <CheckCircle className="w-5 h-5" /> : index + 1}
                </div>
                <span className={`text-xs font-medium text-center hidden sm:block ${pasoActual === index + 1 ? 'text-primary' : 'text-slate-500'}`}>
                  {paso}
                </span>
              </div>
            ))}
          </div>
          <div className="form-step-indicator">
            <div className="form-step-progress" style={{ width: `${(pasoActual / 3) * 100}%` }}></div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
          <AnimatePresence mode="wait">
            {pasoActual === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl font-bold mb-6 text-slate-900">Datos Personales</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} className="w-full" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Apellidos *</label>
                    <input type="text" name="apellidos" value={formData.apellidos} onChange={handleInputChange} className="w-full" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">DNI/NIE *</label>
                    <input type="text" name="dni_nie" value={formData.dni_nie} onChange={handleInputChange} className="w-full" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono *</label>
                    <input type="tel" name="telefono" value={formData.telefono} onChange={handleInputChange} className="w-full" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Nacimiento *</label>
                    <input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleInputChange} className="w-full" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Ciudad Residencia *</label>
                    <input type="text" name="ciudad" value={formData.ciudad} onChange={handleInputChange} className="w-full" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Años de Experiencia *</label>
                    <input type="number" name="anos_experiencia" min="0" value={formData.anos_experiencia} onChange={handleInputChange} className="w-full" required />
                  </div>
                </div>
                
                <div className="mt-6 space-y-3 border-t border-slate-100 pt-6">
                  <label className="flex items-center space-x-3">
                    <Checkbox checked={formData.disponibilidad_inmediata} onCheckedChange={(c) => setFormData({...formData, disponibilidad_inmediata: c})} />
                    <span className="text-sm text-slate-700">Tengo disponibilidad inmediata</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <Checkbox checked={formData.carnet_conducir} onCheckedChange={(c) => setFormData({...formData, carnet_conducir: c})} />
                    <span className="text-sm text-slate-700">Tengo carnet de conducir</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <Checkbox checked={formData.vehiculo_propio} onCheckedChange={(c) => setFormData({...formData, vehiculo_propio: c})} />
                    <span className="text-sm text-slate-700">Dispongo de vehículo propio</span>
                  </label>
                </div>
              </motion.div>
            )}

            {pasoActual === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl font-bold mb-6 text-slate-900">Documentos</h2>
                <div className="space-y-6">
                  
                  {/* Upload CV */}
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50 transition-colors hover:bg-slate-100">
                    <UploadCloud className="w-10 h-10 text-primary mx-auto mb-4" />
                    <h3 className="text-sm font-bold text-slate-900 mb-1">Sube tu Currículum Vitae (Obligatorio)</h3>
                    <p className="text-xs text-slate-500 mb-4">PDF, DOC o DOCX hasta 5MB</p>
                    
                    {formData.cv_name ? (
                      <div className="flex items-center justify-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 inline-flex mx-auto">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">{formData.cv_name}</span>
                        <button type="button" onClick={() => setFormData({...formData, cv_name: '', cv_file: null})} className="text-red-500 hover:text-red-700 ml-2 text-xs font-bold">Quitar</button>
                      </div>
                    ) : (
                      <div className="relative">
                        <input type="file" onChange={(e) => handleFileUpload(e, 'cv')} accept=".pdf,.doc,.docx" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <Button variant="outline" type="button">Seleccionar archivo</Button>
                      </div>
                    )}
                  </div>

                  {fileError && <p className="text-sm text-red-500 text-center">{fileError}</p>}

                  {/* Upload Carta (Optional) */}
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50 transition-colors hover:bg-slate-100">
                    <h3 className="text-sm font-bold text-slate-900 mb-1">Carta de Presentación (Opcional)</h3>
                    {formData.carta_name ? (
                      <div className="flex items-center justify-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 inline-flex mx-auto mt-2">
                        <FileText className="w-4 h-4 text-slate-600" />
                        <span className="text-sm font-medium">{formData.carta_name}</span>
                      </div>
                    ) : (
                      <div className="relative mt-4">
                        <input type="file" onChange={(e) => handleFileUpload(e, 'carta')} accept=".pdf,.doc,.docx" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <Button variant="secondary" size="sm" type="button">Subir carta</Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {pasoActual === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl font-bold mb-6 text-slate-900">Preguntas de Cribado</h2>
                
                {/* Permiso Mandatory Check */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-8">
                  <h3 className="font-bold text-slate-900 mb-3">¿Tienes permiso de trabajo válido en España? *</h3>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="permiso_trabajo" value="Sí" checked={formData.permiso_trabajo === 'Sí'} onChange={handleInputChange} className="w-4 h-4 text-primary" />
                      <span>Sí</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="permiso_trabajo" value="No" checked={formData.permiso_trabajo === 'No'} onChange={handleInputChange} className="w-4 h-4 text-primary" />
                      <span>No</span>
                    </label>
                  </div>
                </div>

                {formData.permiso_trabajo === 'No' && (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3 mb-6">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800 font-medium">
                      Lo sentimos, para esta oferta es imprescindible contar con permiso de trabajo válido en España. No podrás continuar con la inscripción.
                    </p>
                  </div>
                )}

                {formData.permiso_trabajo === 'Sí' && (
                  <div className="space-y-6">
                    {/* Mock Questions */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">¿Cuál es tu nivel de Inglés? *</label>
                      <select className="w-full" required>
                        <option value="">Selecciona...</option>
                        <option value="B1">B1</option>
                        <option value="B2">B2</option>
                        <option value="C1">C1 o superior</option>
                      </select>
                    </div>

                    <div className="pt-6 border-t border-slate-100 mt-8">
                      <label className="flex items-start gap-3 cursor-pointer bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <Checkbox checked={formData.policy_accepted} onCheckedChange={(c) => setFormData({...formData, policy_accepted: c})} className="mt-1" />
                        <span className="text-sm text-slate-700 leading-relaxed">
                          He leído y acepto la <Link to="/privacy-policy" className="text-primary hover:underline font-semibold" target="_blank">Política de Privacidad</Link>. Entiendo que mis datos serán tratados por FITJOB SL para gestionar mi candidatura. *
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Buttons Footer */}
        <div className="flex items-center justify-between mt-8">
          <Button variant="outline" onClick={prevStep} disabled={pasoActual === 1 || isSubmitting} className="w-32">
            Anterior
          </Button>
          
          {pasoActual < 3 ? (
            <Button onClick={nextStep} className="w-32">
              Siguiente <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={formData.permiso_trabajo !== 'Sí' || !formData.policy_accepted || isSubmitting}
              className="bg-primary hover:bg-primary/90 text-white w-48 font-bold"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar candidatura'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormularioInscripcion;