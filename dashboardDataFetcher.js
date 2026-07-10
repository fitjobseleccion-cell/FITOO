import pb from '@/lib/pocketbaseClient.js';

/**
 * Calculates the completeness percentage of a CV based on its formData.
 * @param {Object} cvData - The CV draft record.
 * @returns {number} Percentage between 0 and 100.
 */
export const calculateCVCompleteness = (cvData) => {
  if (!cvData || !cvData.formData) return 0;
  
  const data = cvData.formData;
  let totalFields = 0;
  let filledFields = 0;

  const checkField = (value) => {
    totalFields++;
    if (value && value.toString().trim() !== '') {
      filledFields++;
    }
  };

  // Basic info
  checkField(data.personalInfo?.firstName);
  checkField(data.personalInfo?.lastName);
  checkField(data.personalInfo?.email);
  checkField(data.personalInfo?.phone);
  checkField(data.personalInfo?.summary);

  // Arrays (count as filled if they have at least one item)
  totalFields++;
  if (data.experience?.length > 0) filledFields++;
  
  totalFields++;
  if (data.education?.length > 0) filledFields++;
  
  totalFields++;
  if (data.skills?.length > 0) filledFields++;

  if (totalFields === 0) return 0;
  return Math.round((filledFields / totalFields) * 100);
};

/**
 * Generates an activity timeline from various dashboard collections.
 * @param {Object} data - Aggregated dashboard data.
 * @returns {Array} Sorted array of timeline events.
 */
export const getActivityTimeline = (data) => {
  const timeline = [];

  // Candidaturas
  if (data.candidaturas?.length > 0) {
    data.candidaturas.forEach(c => {
      const jobTitle = c.expand?.oferta_id?.puesto || c.expand?.oferta_id?.titulo || 'Oferta de empleo';
      timeline.push({
        id: `cand_${c.id}`,
        type: 'candidatura',
        title: 'Nueva candidatura',
        description: `Te has inscrito en ${jobTitle}`,
        date: c.created,
        color: 'text-blue-500 bg-blue-100 border-blue-200',
        icon: '📬'
      });
    });
  }

  // CV Updates
  if (data.cvData) {
    timeline.push({
      id: `cv_${data.cvData.id}`,
      type: 'cv',
      title: 'Currículum Actualizado',
      description: 'Has guardado cambios en tu CV',
      date: data.cvData.updated,
      color: 'text-purple-500 bg-purple-100 border-purple-200',
      icon: '📝'
    });
  }

  // Courses
  if (data.courses?.length > 0) {
    data.courses.forEach(course => {
      timeline.push({
        id: `course_${course.id}`,
        type: 'course',
        title: 'Curso Iniciado',
        description: `Empezaste el curso: ${course.expand?.curso_id?.nombre || 'Formación'}`,
        date: course.created,
        color: 'text-orange-500 bg-orange-100 border-orange-200',
        icon: '🎓'
      });
    });
  }

  // Diagnosis
  if (data.diagnosis?.length > 0) {
    data.diagnosis.forEach(diag => {
      timeline.push({
        id: `diag_${diag.id}`,
        type: 'diagnosis',
        title: 'Diagnóstico Completado',
        description: 'Has finalizado una evaluación de habilidades',
        date: diag.created,
        color: 'text-green-500 bg-green-100 border-green-200',
        icon: '🎯'
      });
    });
  }

  // Sort by date descending
  return timeline.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const getStatusLabel = (estado) => {
  const normalized = estado?.toLowerCase() || '';
  if (normalized.includes('recibido')) return 'Recibido';
  if (normalized.includes('revision') || normalized.includes('revisión')) return 'En revisión';
  if (normalized.includes('preseleccionado')) return 'Preseleccionado';
  if (normalized.includes('entrevista')) return 'Entrevista';
  if (normalized.includes('finalista')) return 'Finalista';
  if (normalized.includes('contratado')) return 'Contratado';
  if (normalized.includes('descartado')) return 'Descartado';
  return estado || 'Pendiente';
};

export const getStatusColor = (estado) => {
  const normalized = estado?.toLowerCase() || '';
  if (normalized.includes('recibido')) return { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200', icon: '📬' };
  if (normalized.includes('revision') || normalized.includes('revisión')) return { bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-300', border: 'border-yellow-200', icon: '👀' };
  if (normalized.includes('preseleccionado')) return { bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200', icon: '⭐' };
  if (normalized.includes('entrevista')) return { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200', icon: '🎤' };
  if (normalized.includes('finalista')) return { bg: 'bg-teal-50 dark:bg-teal-900/20', text: 'text-teal-700 dark:text-teal-300', border: 'border-teal-200', icon: '🏆' };
  if (normalized.includes('contratado')) return { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-300', border: 'border-green-200', icon: '🎉' };
  if (normalized.includes('descartado')) return { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-300', border: 'border-red-200', icon: '❌' };
  
  return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', icon: '📌' };
};

/**
 * Safely fetches dashboard data from multiple PocketBase collections.
 * Gracefully handles missing collections or permission errors.
 * @param {string} userId - Current user ID.
 * @returns {Promise<Object>} Aggregated data object.
 */
export const getCandidateDashboardData = async (userId) => {
  const result = {
    candidaturas: [],
    cvData: null,
    courses: [],
    premiumServices: [],
    interviews: [],
    recommendations: [],
    diagnosis: []
  };

  if (!userId) return result;

  // 1. Fetch Candidaturas
  try {
    const candidaturas = await pb.collection('candidaturas').getFullList({
      filter: `usuario_id = "${userId}" || email = "${pb.authStore.model?.email}"`,
      expand: 'oferta_id',
      sort: '-created',
      $autoCancel: false
    });
    result.candidaturas = candidaturas;
  } catch (error) {
    console.log('No candidaturas found or collection inaccessible', error.message);
  }

  // 2. Fetch CV Drafts
  try {
    const cvs = await pb.collection('cv_drafts').getFullList({
      filter: `userId = "${userId}"`,
      sort: '-updated',
      $autoCancel: false
    });
    if (cvs.length > 0) {
      result.cvData = cvs[0];
    }
  } catch (error) {
    console.log('No cv_drafts found or collection inaccessible', error.message);
  }

  // 3. Fetch Courses (cursos_usuario)
  try {
    const courses = await pb.collection('cursos_usuario').getFullList({
      filter: `usuario_id = "${userId}"`,
      expand: 'curso_id',
      sort: '-created',
      $autoCancel: false
    });
    result.courses = courses;
  } catch (error) {
    console.log('No courses found or collection inaccessible', error.message);
  }

  // 4. Fetch Premium Services (payments)
  try {
    const services = await pb.collection('payments').getFullList({
      filter: `userId = "${userId}" && status = "completed"`,
      sort: '-created',
      $autoCancel: false
    });
    result.premiumServices = services;
  } catch (error) {
    console.log('No premium services found or collection inaccessible', error.message);
  }

  // 5. Fetch Interviews (entrevistas)
  try {
    const interviews = await pb.collection('entrevistas').getFullList({
      filter: `usuario_id = "${userId}"`,
      expand: 'oferta_id',
      sort: 'fecha_entrevista',
      $autoCancel: false
    });
    result.interviews = interviews;
  } catch (error) {
    console.log('No interviews found or collection inaccessible', error.message);
  }

  // 6. Fetch Recommendations (recomendaciones)
  try {
    const recommendations = await pb.collection('recomendaciones').getFullList({
      filter: `usuario_id = "${userId}"`,
      expand: 'oferta_id',
      sort: '-score',
      $autoCancel: false
    });
    result.recommendations = recommendations;
  } catch (error) {
    console.log('No recommendations found or collection inaccessible', error.message);
  }

  // 7. Fetch Diagnosis (diagnosticos_profesionales)
  try {
    const diagnosis = await pb.collection('diagnosticos_profesionales').getFullList({
      filter: `usuario_id = "${userId}"`,
      sort: '-created',
      $autoCancel: false
    });
    result.diagnosis = diagnosis;
  } catch (error) {
    console.log('No diagnosis found or collection inaccessible', error.message);
  }

  return result;
};