import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Briefcase, Clock, Euro, Building2, HelpCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const JobPreviewModal = ({ isOpen: propIsOpen, onClose, formData: propFormData, questions: propQuestions }) => {
  // All hooks at the top level
  const location = useLocation();
  const navigate = useNavigate();
  
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [data, setData] = useState(null);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    // If used as a route component, it reads from location state
    const isRoute = location.pathname.includes('/vista-previa');
    if (isRoute) {
      setInternalIsOpen(true);
      setData(location.state?.formData || null);
      setQuestions(location.state?.questions || []);
    } else {
      setInternalIsOpen(propIsOpen || false);
      setData(propFormData || null);
      setQuestions(propQuestions || []);
    }
  }, [location, propIsOpen, propFormData, propQuestions]);

  const handleClose = () => {
    if (location.pathname.includes('/vista-previa')) {
      navigate(-1); // Go back if it's a route
    } else if (onClose) {
      onClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  // Logic after hooks
  if (!data) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getSalaryRange = () => {
    if (!data.salario_minimo && !data.salario_maximo) return 'Salario no especificado';
    if (data.salario_minimo && data.salario_maximo) return `${data.salario_minimo}€ - ${data.salario_maximo}€ brutos/año`;
    if (data.salario_minimo) return `Desde ${data.salario_minimo}€ brutos/año`;
    return `Hasta ${data.salario_maximo}€ brutos/año`;
  };

  return (
    <Dialog open={internalIsOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4 mb-4">
          <DialogTitle className="text-2xl font-bold">Vista previa de la oferta</DialogTitle>
          <DialogDescription>
            Así es como verán los candidatos esta oferta una vez publicada. No se guardará en la base de datos hasta que hagas clic en Guardar.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 pb-6">
          <div className="flex flex-wrap gap-2">
            {data.destacada && <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-200">Destacada</Badge>}
            {data.urgente && <Badge variant="destructive">Urgente</Badge>}
            {data.incorporacion_inmediata && <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">Incorporación inmediata</Badge>}
            <Badge variant="outline" className="capitalize">{data.estado}</Badge>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground leading-tight">
            {data.puesto || data.titulo || 'Puesto no definido'}
          </h1>
          
          <div className="flex items-center text-lg text-muted-foreground font-medium">
            <Building2 className="w-5 h-5 mr-2 text-primary" />
            {data.empresa || 'Empresa no definida'}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-border">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground flex items-center">
                <MapPin className="w-4 h-4 mr-1" /> Ubicación
              </div>
              <div className="font-semibold text-foreground">
                {data.ciudad ? `${data.ciudad}, ${data.provincia}` : 'No definida'}
                {data.modalidad && <span className="block text-xs font-normal text-muted-foreground">{data.modalidad}</span>}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground flex items-center">
                <Briefcase className="w-4 h-4 mr-1" /> Contrato
              </div>
              <div className="font-semibold text-foreground capitalize">{data.tipo_contrato || 'No definido'}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground flex items-center">
                <Clock className="w-4 h-4 mr-1" /> Jornada
              </div>
              <div className="font-semibold text-foreground capitalize">{data.jornada || 'No definida'}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground flex items-center">
                <Euro className="w-4 h-4 mr-1" /> Salario
              </div>
              <div className="font-semibold text-foreground text-sm">{getSalaryRange()}</div>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <h3 className="text-xl font-bold text-foreground mb-4">Descripción del puesto</h3>
            <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed mb-8">
              {data.descripcion || 'Sin descripción'}
            </div>

            {data.funciones && (
              <>
                <h3 className="text-xl font-bold text-foreground mb-4">Funciones principales</h3>
                <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed mb-8">
                  {data.funciones}
                </div>
              </>
            )}

            {data.requisitos && (
              <>
                <h3 className="text-xl font-bold text-foreground mb-4">Requisitos</h3>
                <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed mb-8">
                  {data.requisitos}
                </div>
              </>
            )}

            {data.beneficios && (
              <>
                <h3 className="text-xl font-bold text-foreground mb-4">Beneficios</h3>
                <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed mb-8">
                  {data.beneficios}
                </div>
              </>
            )}
          </div>

          {questions && questions.length > 0 && (
            <div className="border-t border-border pt-8 mt-8">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
                <HelpCircle className="w-5 h-5 mr-2 text-primary" />
                Preguntas de candidatura ({questions.length})
              </h3>
              <div className="space-y-4">
                {questions.map((q, idx) => (
                  <div key={idx} className="bg-muted p-4 rounded-xl">
                    <p className="font-medium text-foreground mb-2">{idx + 1}. {q.pregunta}</p>
                    <div className="flex gap-2 text-xs">
                      <Badge variant="secondary" className="capitalize">{q.tipo.replace('_', ' ')}</Badge>
                      {q.obligatoria && <Badge variant="outline" className="border-red-200 text-red-600">Obligatoria</Badge>}
                      {q.es_permiso_trabajo && <Badge variant="outline" className="border-primary/30 text-primary">Permiso de Trabajo</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-primary/5 p-4 rounded-xl">
            <div>
              <p className="text-sm text-muted-foreground">Fecha de incorporación prevista:</p>
              <p className="font-medium">{formatDate(data.fecha_incorporacion) || 'No especificada'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Límite de recepción de candidaturas:</p>
              <p className="font-medium">{formatDate(data.fecha_cierre) || 'No especificada'}</p>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={handleClose}>Cerrar vista previa</Button>
          <Button onClick={handleClose} className="bg-primary text-primary-foreground">Continuar Editando</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JobPreviewModal;