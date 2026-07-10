export const useFormValidation = () => {
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    return /^\+?[\d\s-]{9,15}$/.test(phone);
  };

  const validateDNI = (dni) => {
    return /^[0-9XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/i.test(dni);
  };

  const validateAge = (dateOfBirth) => {
    if (!dateOfBirth) return false;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 16;
  };

  const validateFile = (file, maxSizeMB = 5, allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']) => {
    if (!file) return { valid: false, error: 'Archivo requerido' };
    if (file.size > maxSizeMB * 1024 * 1024) return { valid: false, error: `El archivo debe ser menor de ${maxSizeMB}MB` };
    if (!allowedTypes.includes(file.type)) return { valid: false, error: 'Formato no válido. Use PDF o DOC/DOCX' };
    return { valid: true };
  };

  return {
    validateEmail,
    validatePhone,
    validateDNI,
    validateAge,
    validateFile,
  };
};