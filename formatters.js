import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatSalary = (min, max) => {
  if (!min && !max) return 'Salario no especificado';
  if (!max) return `Desde ${min.toLocaleString('es-ES')}€ brutos/mes`;
  if (!min) return `Hasta ${max.toLocaleString('es-ES')}€ brutos/mes`;
  return `${min.toLocaleString('es-ES')}€ - ${max.toLocaleString('es-ES')}€ brutos/mes`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  return `hace ${formatDistanceToNow(new Date(dateString), { locale: es })}`;
};

export const calculateAge = (birthDateString) => {
  if (!birthDateString) return 0;
  const today = new Date();
  const birthDate = new Date(birthDateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const validatePermiso = (hasPermiso) => {
  return hasPermiso === 'Sí' || hasPermiso === true;
};

export const abreviarNombreCandidato = (nombre, apellidos) => {
  if (!nombre) return 'Candidato';
  const apellidoInicial = apellidos && apellidos.trim().length > 0 
    ? `${apellidos.trim().charAt(0)}.` 
    : '';
  return `${nombre.trim()} ${apellidoInicial}`.trim();
};