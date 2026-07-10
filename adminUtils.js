import { Clock, CheckCircle, XCircle, FileText, AlertCircle } from 'lucide-react';

export const formatEstadoAdmin = (estado) => {
  const states = {
    Borrador: { label: 'Borrador', color: 'bg-slate-100 text-slate-700', icon: FileText },
    Publicada: { label: 'Publicada', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    Pausada: { label: 'Pausada', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    Cerrada: { label: 'Cerrada', color: 'bg-red-100 text-red-800', icon: XCircle },
    // Candidato states
    recibido: { label: 'Recibido', color: 'bg-slate-100 text-slate-700', icon: Clock },
    en_revision: { label: 'En revisión', color: 'bg-blue-100 text-blue-800', icon: AlertCircle },
    preseleccionado: { label: 'Preseleccionado', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    descartado: { label: 'Descartado', color: 'bg-red-100 text-red-800', icon: XCircle },
  };
  return states[estado] || { label: estado, color: 'bg-slate-100 text-slate-700', icon: Clock };
};

export const calculateConversionRate = (preseleccionados, total) => {
  if (!total || total === 0) return 0;
  return ((preseleccionados / total) * 100).toFixed(1);
};

export const formatPuntuacion = (puntuacion, max = 100) => {
  if (puntuacion === null || puntuacion === undefined) return { text: 'N/A', stars: 0 };
  const percentage = (puntuacion / max) * 100;
  const stars = Math.round((percentage / 100) * 5);
  return {
    text: `${percentage.toFixed(0)}%`,
    percentage,
    stars
  };
};

export const validateOferta = (oferta) => {
  const errors = {};
  if (!oferta.titulo || oferta.titulo.trim() === '') errors.titulo = 'El título es obligatorio';
  if (!oferta.descripcion_corta || oferta.descripcion_corta.length < 50) errors.descripcion_corta = 'La descripción corta debe tener al menos 50 caracteres';
  if (oferta.salario_minimo && oferta.salario_maximo && Number(oferta.salario_minimo) > Number(oferta.salario_maximo)) {
    errors.salario = 'El salario mínimo no puede ser mayor al máximo';
  }
  return { isValid: Object.keys(errors).length === 0, errors };
};