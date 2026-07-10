import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

import BarraProgreso from './BarraProgreso.jsx';
import Paso1Empresa from './Paso1Empresa.jsx';
import Paso2Oferta from './Paso2Oferta.jsx';
import Paso3Candidato from './Paso3Candidato.jsx';
import Paso4Revision from './Paso4Revision.jsx';

const initialFormData = {
  empresa_nombre: '',
  empresa_nombre_legal: '',
  empresa_cif: '',
  empresa_tipo_negocio: '',
  empresa_domicilio: '',
  empresa_representante_nombre: '',
  empresa_representante_cargo: '',
  empresa_email: '',
  empresa_telefono: '',
  empresa_ciudad: '',
  empresa_sector: '',
  empresa_tamano: '',
  empresa_ubicacion: '',
  
  oferta_titulo: '',
  oferta_vacantes: '',
  oferta_tipo_contrato: '',
  oferta_duracion_contrato: '',
  oferta_periodo_prueba: 'Sin periodo de prueba',
  oferta_tipo_jornada: '',
  oferta_horario: {
    lunes: { inicio: '', fin: '' },
    martes: { inicio: '', fin: '' },
    miercoles: { inicio: '', fin: '' },
    jueves: { inicio: '', fin: '' },
    viernes: { inicio: '', fin: '' },
    sabado: { inicio: '', fin: '' }
  },
  oferta_dias_libres: '',
  oferta_fecha_incorporacion: '',
  oferta_sueldo: '',
  oferta_ubicacion: '',
  oferta_modalidad: '',
  oferta_urgencia: '',
  oferta_descripcion: '',
  oferta_salario_desde: '',
  oferta_salario_hasta: '',
  oferta_experiencia: '',
  
  candidato_experiencia_minima: '',
  candidato_tipo_servicio: '',
  candidato_habilidades: '',
  candidato_ritmo_trabajo: '',
  candidato_tipo_turno: '',
  candidato_fines_semana: '',
  candidato_prueba_practica: '',
  candidato_prueba_remunerada: '',
  candidato_descripcion_funciones: '',
  candidato_incentivos: '',
  candidato_detalles_incentivos: '',
  candidato_formacion: '',
  candidato_idiomas: [],
  candidato_competencias: [],
  candidato_requisitos: '',
  candidato_permiso_trabajo: '',

  website: ''
};

const mapFormDataToGoogleSheets = (formData, idSolicitud) => {
  let horarioFormat = formData.oferta_horario || '';
  if (typeof formData.oferta_horario === 'object' && formData.oferta_horario !== null) {
    const dayNames = { lunes: 'Lunes', martes: 'Martes', miercoles: 'Miércoles', jueves: 'Jueves', viernes: 'Viernes', sabado: 'Sábado' };
    horarioFormat = Object.entries(formData.oferta_horario)
      .filter(([_, h]) => h.inicio && h.fin)
      .map(([d, h]) => `${dayNames[d] || d}: ${h.inicio}-${h.fin}`)
      .join(' | ');
  }

  return {
    idSolicitud,
    tipoNegocio: formData.empresa_tipo_negocio || '',
    numeroVacantes: formData.oferta_vacantes || '',
    tipoJornada: formData.oferta_tipo_jornada || '',
    experienciaMinima: formData.candidato_experiencia_minima || '',
    fechaIncorporacion: formData.oferta_fecha_incorporacion || '',
    sueldoAproximado: formData.oferta_sueldo || '',
    ubicacionPuesto: formData.oferta_ubicacion || '',
    tipoContrato: formData.oferta_tipo_contrato || '',
    nombreEmpresa: formData.empresa_nombre || '',
    cif: formData.empresa_cif || '',
    domicilioSocial: formData.empresa_domicilio || '',
    horario: horarioFormat,
    correo: formData.empresa_email || '',
    telefono: formData.empresa_telefono || '',
    nombreRepresentante: formData.empresa_representante_nombre || '',
    cargo: formData.empresa_representante_cargo || '',
    duracionContrato: formData.oferta_duracion_contrato || '',
    periodoPrueba: formData.oferta_periodo_prueba || '',
    incentivos: formData.candidato_incentivos || '',
    nivelUrgencia: formData.oferta_urgencia || '',
    puestoCubrir: formData.oferta_titulo || '',
    diasLibres: formData.oferta_dias_libres || '',
    detallesIncentivos: formData.candidato_detalles_incentivos || '',
    modalidadTrabajo: formData.oferta_modalidad || '',
    descripcionFunciones: formData.candidato_descripcion_funciones || '',
    tipoServicioExperiencia: formData.candidato_tipo_servicio || '',
    ritmoTrabajo: formData.candidato_ritmo_trabajo || '',
    habilidades: formData.candidato_habilidades || '',
    tipoTurno: formData.candidato_tipo_turno || '',
    finesSemana: formData.candidato_fines_semana || '',
    pruebaPractica: formData.candidato_prueba_practica || '',
    ciudad: formData.empresa_ciudad || '',
    nombreLegalEmpresa: formData.empresa_nombre_legal || '',
    pruebaRemunerada: formData.candidato_prueba_remunerada || ''
  };
};

const validateRequiredFields = (formData) => {
  const required = [
    'empresa_tipo_negocio', 'oferta_vacantes', 'oferta_tipo_jornada', 'candidato_experiencia_minima',
    'oferta_fecha_incorporacion', 'oferta_sueldo', 'oferta_ubicacion', 'oferta_tipo_contrato',
    'empresa_nombre', 'empresa_cif', 'empresa_domicilio', 'oferta_horario', 'empresa_email',
    'empresa_telefono', 'empresa_nombre_legal', 'empresa_representante_nombre', 'empresa_representante_cargo',
    'oferta_periodo_prueba', 'oferta_urgencia',
    'oferta_titulo', 'oferta_modalidad',
    'candidato_descripcion_funciones', 'candidato_tipo_servicio', 'candidato_ritmo_trabajo',
    'candidato_habilidades', 'candidato_tipo_turno', 'candidato_fines_semana', 'candidato_prueba_practica',
    'empresa_ciudad', 'candidato_prueba_remunerada'
  ];
  
  for (const field of required) {
    if (field === 'oferta_horario') {
      if (typeof formData[field] === 'object' && formData[field] !== null) {
        const hasSchedule = Object.values(formData[field]).some(h => h.inicio && h.fin);
        if (!hasSchedule) return false;
      } else if (!formData[field] || String(formData[field]).trim() === '') {
        return false;
      }
      continue;
    }

    if (!formData[field] || String(formData[field]).trim() === '') {
      return false;
    }
  }
  return true;
};

export default function FormularioContratacion({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isConsentGiven, setIsConsentGiven] = useState(false);
  const [isNotRobot, setIsNotRobot] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Load any existing data from localStorage to pre-fill the form (e.g. when editing)
      const savedData = localStorage.getItem('fitjobSolicitudData');
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setFormData(prev => ({ ...prev, ...parsed }));
          setIsConsentGiven(true);
          setIsNotRobot(true);
        } catch (e) {
          console.error('Error parsing local storage solicitud data', e);
        }
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const validateField = useCallback((field, value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\d\s\+\-]{9,15}$/;

    switch (field) {
      case 'empresa_nombre':
        return !value?.trim() ? 'El nombre es obligatorio' : null;
      case 'empresa_email':
        return !value?.trim() || !emailRegex.test(value) ? 'Email inválido' : null;
      case 'empresa_telefono':
        return !value?.trim() || !phoneRegex.test(value) ? 'Teléfono inválido (9-15 dígitos, admite +, -, espacios)' : null;
      case 'oferta_titulo':
        return !value?.trim() ? 'El puesto es obligatorio' : null;
      case 'oferta_vacantes':
        return !value ? 'Indique el número de vacantes' : null;
      case 'oferta_tipo_contrato':
        return !value ? 'Seleccione el tipo de contrato' : null;
      case 'oferta_fecha_incorporacion':
        return !value ? 'Seleccione la fecha de incorporación' : null;
      default:
        return null;
    }
  }, []);

  const updateData = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    const errorMsg = validateField(field, value);
    if (!errorMsg) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    } else {
      setErrors(prev => (prev[field] ? { ...prev, [field]: errorMsg } : prev));
    }
  }, [validateField]);

  const getStepErrors = useCallback((step) => {
    const newErrors = {};
    if (step === 1) {
      const eName = validateField('empresa_nombre', formData.empresa_nombre);
      const eEmail = validateField('empresa_email', formData.empresa_email);
      const ePhone = validateField('empresa_telefono', formData.empresa_telefono);
      if (eName) newErrors.empresa_nombre = eName;
      if (eEmail) newErrors.empresa_email = eEmail;
      if (ePhone) newErrors.empresa_telefono = ePhone;
    } else if (step === 2) {
      const oPuesto = validateField('oferta_titulo', formData.oferta_titulo);
      const oVacantes = validateField('oferta_vacantes', formData.oferta_vacantes);
      const oContrato = validateField('oferta_tipo_contrato', formData.oferta_tipo_contrato);
      const oFecha = validateField('oferta_fecha_incorporacion', formData.oferta_fecha_incorporacion);
      if (oPuesto) newErrors.oferta_titulo = oPuesto;
      if (oVacantes) newErrors.oferta_vacantes = oVacantes;
      if (oContrato) newErrors.oferta_tipo_contrato = oContrato;
      if (oFecha) newErrors.oferta_fecha_incorporacion = oFecha;
    }
    return newErrors;
  }, [formData, validateField]);

  const validateCurrentStep = useCallback(() => {
    const newErrors = getStepErrors(currentStep);
    if (Object.keys(newErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...newErrors }));
      toast.error('Por favor, corrija los campos marcados en rojo antes de continuar.', { 
        icon: <AlertCircle className="w-5 h-5 text-destructive" /> 
      });
      return false;
    }
    return true;
  }, [currentStep, getStepErrors]);

  const hasAnyErrors = useCallback(() => {
    const required = [
      'empresa_tipo_negocio', 'oferta_vacantes', 'oferta_tipo_jornada', 'candidato_experiencia_minima',
      'oferta_fecha_incorporacion', 'oferta_sueldo', 'oferta_ubicacion', 'oferta_tipo_contrato',
      'empresa_nombre', 'empresa_cif', 'empresa_domicilio', 'oferta_horario', 'empresa_email',
      'empresa_telefono', 'empresa_nombre_legal', 'empresa_representante_nombre', 'empresa_representante_cargo',
      'oferta_periodo_prueba', 'oferta_urgencia',
      'oferta_titulo', 'oferta_modalidad',
      'candidato_descripcion_funciones', 'candidato_tipo_servicio', 'candidato_ritmo_trabajo',
      'candidato_habilidades', 'candidato_tipo_turno', 'candidato_fines_semana', 'candidato_prueba_practica',
      'empresa_ciudad', 'candidato_prueba_remunerada'
    ];
    for (const field of required) {
      if (field === 'oferta_horario') {
        if (typeof formData[field] === 'object' && formData[field] !== null) {
          const hasSchedule = Object.values(formData[field]).some(h => h.inicio && h.fin);
          if (!hasSchedule) return true;
        } else if (!formData[field] || String(formData[field]).trim() === '') {
          return true;
        }
        continue;
      }
      if (!formData[field] || String(formData[field]).trim() === '') {
        return true;
      }
    }
    return false;
  }, [formData]);

  const handleNext = useCallback(() => {
    if (validateCurrentStep()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const container = document.getElementById('modal-scroll-container');
      if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
      setCurrentStep(prev => prev + 1);
    }
  }, [validateCurrentStep]);

  const handlePrev = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const container = document.getElementById('modal-scroll-container');
    if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep(prev => prev - 1);
  }, []);

  const handleForceClose = useCallback(() => {
    setShowConfirmClose(false);
    setCurrentStep(1);
    setFormData(initialFormData);
    setErrors({});
    setIsSuccess(false);
    setIsSubmitting(false);
    setIsConsentGiven(false);
    setIsNotRobot(false);
    onClose();
  }, [onClose]);

  const handleCloseAttempt = useCallback(() => {
    const hasData = Object.entries(formData).some(([key, val]) => {
      if (key === 'oferta_horario') {
        return Object.values(val).some(h => h.inicio || h.fin);
      }
      if (key === 'oferta_periodo_prueba' && val === 'Sin periodo de prueba') {
        return false;
      }
      return (Array.isArray(val) && val.length > 0) || 
             (typeof val === 'string' && val.length > 0) ||
             (typeof val === 'object' && val !== null && Object.keys(val).length > 0);
    });
    
    if (hasData && !isSuccess) {
      setShowConfirmClose(true);
    } else {
      handleForceClose();
    }
  }, [formData, isSuccess, handleForceClose]);

  const handleSubmit = async () => {
    const idSolicitud = `FJ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    if (!isConsentGiven) {
      toast.error('Debes aceptar la Política de Privacidad para continuar');
      return;
    }

    if (!isNotRobot) {
      toast.error('Por favor, confirma que no eres un robot');
      return;
    }

    if (!validateRequiredFields(formData)) {
      toast.error('Faltan campos obligatorios por completar. Por favor, revise el formulario.');
      return;
    }

    setIsSubmitting(true);
    const datosEnvio = mapFormDataToGoogleSheets(formData, idSolicitud);
    
    try {
      await fetch('https://script.google.com/macros/s/AKfycbwQtuxzBce4qmfIPU1xHReT8-NzLYg0w6V2jeWS5J1NwVgcQgtQ_9DUBHWDBEMpQthB/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosEnvio)
      });
      
      // Save to local storage for checkout
      localStorage.setItem('fitjobEmail', formData.empresa_email);
      localStorage.setItem('fitjobSolicitudId', idSolicitud);
      localStorage.setItem('fitjobSolicitudData', JSON.stringify(formData));
      
      setIsSuccess(true);
      toast.success('Solicitud recibida correctamente.', { duration: 3000 });
      
      navigate('/checkout');
      
      // Auto-close modal after slight delay
      setTimeout(() => {
        onClose();
        setIsSubmitting(false); // Reset state for future modal opens
      }, 500);

    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error('No hemos podido guardar tu solicitud. Por favor, inténtalo de nuevo.');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const currentStepHasErrors = Object.keys(getStepErrors(currentStep)).length > 0;

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-container">
          
          <div className="modal-header">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">Solicitud de Selección de Personal</h2>
              {!isSuccess && <p className="text-sm text-muted-foreground hidden sm:block">Complete la información para que busquemos a su candidato ideal</p>}
            </div>
            <button 
              onClick={handleCloseAttempt}
              className="modal-close"
              aria-label="Cerrar modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="modal-body" id="modal-scroll-container">
            {!isSuccess ? (
              <div className="max-w-4xl mx-auto w-full relative">
                
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={(e) => updateData('website', e.target.value)}
                  style={{ display: 'none' }}
                  tabIndex="-1"
                  autoComplete="off"
                />

                <BarraProgreso currentStep={currentStep} />
                
                <div className="bg-background rounded-xl p-4 md:p-8 shadow-sm border border-border">
                  {currentStep === 1 && <Paso1Empresa formData={formData} updateData={updateData} errors={errors} />}
                  {currentStep === 2 && <Paso2Oferta formData={formData} updateData={updateData} errors={errors} />}
                  {currentStep === 3 && <Paso3Candidato formData={formData} updateData={updateData} errors={errors} />}
                  {currentStep === 4 && (
                    <div className="space-y-8">
                      <Paso4Revision formData={formData} goToStep={setCurrentStep} />
                      
                      <div className="pt-6 border-t border-border space-y-4">
                        <div className="flex items-start gap-3">
                          <Checkbox 
                            id="consent" 
                            checked={isConsentGiven} 
                            onCheckedChange={setIsConsentGiven} 
                            className="mt-1"
                          />
                          <label htmlFor="consent" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                            Al enviar este formulario, autorizo a FITJOB a ponerse en contacto conmigo por teléfono y correo electrónico y acepto la <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Política de Privacidad</a>.
                          </label>
                        </div>
                        <div className="flex items-center gap-3">
                          <Checkbox 
                            id="robot" 
                            checked={isNotRobot} 
                            onCheckedChange={setIsNotRobot} 
                          />
                          <label htmlFor="robot" className="text-sm font-medium text-foreground cursor-pointer">
                            No soy un robot
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center max-w-2xl mx-auto">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-4">¡Redirigiendo!</h3>
                <p className="text-lg text-muted-foreground mb-8">
                  Por favor espera un momento...
                </p>
              </div>
            )}
          </div>

          {!isSuccess && (
            <div className="modal-footer">
              <Button 
                variant="outline" 
                size="lg"
                onClick={handlePrev} 
                disabled={currentStep === 1 || isSubmitting}
                className="w-full sm:w-auto font-medium"
              >
                Anterior
              </Button>
              
              <div className="text-sm font-medium text-muted-foreground hidden sm:block">
                Paso {currentStep} de 4
              </div>

              {currentStep < 4 ? (
                <Button 
                  size="lg"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8"
                >
                  Siguiente
                </Button>
              ) : (
                <Button 
                  size="lg"
                  onClick={handleSubmit}
                  disabled={currentStepHasErrors || hasAnyErrors() || isSubmitting}
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 transition-all"
                >
                  {isSubmitting ? 'Enviando solicitud...' : 'Empezar Proceso de Selección'}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <Dialog open={showConfirmClose} onOpenChange={setShowConfirmClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>¿Seguro que desea salir?</DialogTitle>
            <DialogDescription>
              Se perderán todos los datos introducidos en el formulario. Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowConfirmClose(false)}>
              Continuar editando
            </Button>
            <Button variant="destructive" onClick={handleForceClose}>
              Sí, salir sin guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}