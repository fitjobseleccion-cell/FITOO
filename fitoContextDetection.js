/**
 * @fileoverview Analyzes current application context (URL + active data) to provide
 * contextual suggestions and greetings when opening FITO.
 */

/**
 * Detects the contextual environment of the user based on URL and optional metadata.
 * @param {string} pathname - Current React Router location pathname.
 * @param {Object} [pageData] - Optional specific state data to inject context.
 * @returns {Object|null} Context object with quick actions, or null if default.
 */
export const detectPageContext = (pathname, pageData = {}) => {
  if (pathname.includes('/ofertas-de-trabajo/') || pathname.includes('/ofertas/')) {
    const isDetail = pathname.split('/').length > 2;
    if (isDetail) {
      return {
        type: 'offer_detail',
        title: 'Oferta de empleo',
        message: 'Estás revisando una oferta de trabajo. ¿Quieres que veamos si tu perfil encaja con los requisitos?',
        quickActions: [
          { label: 'Analizar encaje de mi CV', action: 'analyze_cv', data: { context: 'offer' } },
          { label: 'Redactar carta de presentación', action: 'generate_letter', data: { context: 'offer' } },
          { label: 'Dudas sobre esta oferta', action: 'chat', data: { context: 'offer_questions' } }
        ]
      };
    }
  }

  if (pathname.includes('/candidato/mis-candidaturas') || pathname.includes('/panel-candidato')) {
    return {
      type: 'candidatures',
      title: 'Tus candidaturas',
      message: 'Parece que estás revisando el estado de tus procesos. ¿En qué te puedo ayudar?',
      quickActions: [
        { label: 'Preparar próxima entrevista', action: 'practice_interview' },
        { label: 'Revisar mi perfil', action: 'analyze_cv' },
        { label: 'Buscar nuevas ofertas', action: 'navigate', data: { target: '/ofertas-de-trabajo' } }
      ]
    };
  }

  if (pathname.includes('/cv-generator')) {
    return {
      type: 'cv_generator',
      title: 'Creador de CV',
      message: 'Veo que estás creando un nuevo currículum. Una buena estructura es clave.',
      quickActions: [
        { label: 'Ver consejos para destacar', action: 'chat', data: { context: 'cv_tips' } },
        { label: 'Ayuda con mis funciones', action: 'chat', data: { context: 'cv_functions' } }
      ]
    };
  }

  if (pathname.includes('/panel-empresa')) {
    return {
      type: 'empresa_dashboard',
      title: 'Panel de Empresa',
      message: 'Bienvenido al panel de gestión. ¿Qué necesitas para tus procesos de selección?',
      quickActions: [
        { label: 'Crear nueva oferta', action: 'navigate', data: { target: '/crear-oferta' } },
        { label: 'Ayuda sobre filtrado', action: 'chat', data: { context: 'empresa_filters' } },
        { label: 'Soporte especializado', action: 'contact' }
      ]
    };
  }

  return null;
};

/**
 * Returns a simple string greeting from a context object, falling back to a generic one.
 * @param {Object} context - The detected context object.
 * @returns {string}
 */
export const getContextualGreeting = (context) => {
  return context?.message || '¿En qué te puedo ayudar en esta página?';
};