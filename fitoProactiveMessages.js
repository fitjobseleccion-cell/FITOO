import { calculateCVCompleteness } from './fitoUserStateAdapter.js';

const DISABLED_TRIGGERS_KEY = 'fito_disabled_triggers';

export const FITO_PROACTIVE_TRIGGERS = {
  offer_no_apply: {
    id: 'offer_no_apply',
    type: 'suggestion',
    message: 'Hay nuevas ofertas que encajan con tu perfil. ¿Quieres verlas?',
    actionLabel: 'Ver ofertas',
    actionTarget: '/ofertas-de-trabajo'
  },
  candidature_rejected: {
    id: 'candidature_rejected',
    type: 'support',
    message: 'He visto que una de tus candidaturas no avanzó. ¿Quieres que analicemos tu CV para mejorarlo?',
    actionLabel: 'Analizar CV',
    actionTarget: 'analyze_cv'
  },
  cv_incomplete_warning: {
    id: 'cv_incomplete_warning',
    type: 'warning',
    message: 'Tu perfil está incompleto. Las empresas prefieren perfiles al 100%.',
    actionLabel: 'Completar perfil',
    actionTarget: '/panel-candidato'
  },
  no_activity_7days: {
    id: 'no_activity_7days',
    type: 'engagement',
    message: '¡Hola de nuevo! ¿Retomamos tu búsqueda de empleo?',
    actionLabel: 'Buscar empleo',
    actionTarget: '/ofertas-de-trabajo'
  }
};

export const disableProactiveMessage = (triggerId) => {
  const disabled = JSON.parse(localStorage.getItem(DISABLED_TRIGGERS_KEY) || '[]');
  if (!disabled.includes(triggerId)) {
    disabled.push(triggerId);
    localStorage.setItem(DISABLED_TRIGGERS_KEY, JSON.stringify(disabled));
  }
};

export const checkProactiveTriggers = (userState) => {
  if (!userState) return null;
  
  const disabled = JSON.parse(localStorage.getItem(DISABLED_TRIGGERS_KEY) || '[]');
  
  // Check CV completeness
  if (!disabled.includes('cv_incomplete_warning')) {
    const completeness = calculateCVCompleteness(userState.candidato);
    if (completeness > 0 && completeness < 80) {
      return FITO_PROACTIVE_TRIGGERS.cv_incomplete_warning;
    }
  }

  // Check rejected candidatures
  if (!disabled.includes('candidature_rejected') && userState.candidaturas) {
    const recentRejected = userState.candidaturas.find(c => c.estado === 'Descartado');
    if (recentRejected) {
      return FITO_PROACTIVE_TRIGGERS.candidature_rejected;
    }
  }

  return null;
};