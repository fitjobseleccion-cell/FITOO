import { FITO_TRANSLATIONS } from './fitoTranslations.js';
import { getSessionContext } from './fitoSessionContext.js';

export const FITO_CONFIG = {
  workingHours: {
    start: 9, // 9:00 AM
    end: 18, // 6:00 PM
    days: [1, 2, 3, 4, 5] // Monday to Friday
  },
  whatsappNumber: '34600000000',
  privacyUrl: '/privacy-policy'
};

export const getWelcomeMessage = (lang = 'es') => {
  const t = FITO_TRANSLATIONS[lang] || FITO_TRANSLATIONS['es'];
  return t.welcome;
};

export const getFitoMenuOptions = (lang = 'es') => {
  const t = FITO_TRANSLATIONS[lang] || FITO_TRANSLATIONS['es'];
  const sessionContext = getSessionContext();
  
  // We can use sessionContext here to dynamically adjust paths if needed
  // For example, appending query params based on previous searches
  let searchPath = '/ofertas-de-trabajo';
  if (sessionContext?.jobSearchPreferences?.lastQuery) {
    searchPath += `?q=${encodeURIComponent(sessionContext.jobSearchPreferences.lastQuery)}`;
  }

  return [
    { id: 'buscar_empleo', label: t.menu.buscarEmpleo, icon: 'Search', path: searchPath },
    { id: 'crear_cv', label: t.menu.crearCV, icon: 'FileText', path: '/cv-generator' },
    { id: 'analizar_cv', label: t.menu.analizarCV, icon: 'FileSearch', action: 'analyze_cv' },
    { id: 'generar_carta', label: t.menu.generarCarta, icon: 'PenTool', action: 'generate_letter' },
    { id: 'practicar_entrevista', label: t.menu.practicarEntrevista, icon: 'Mic', action: 'practice_interview' },
    { id: 'whatsapp', label: t.menu.whatsapp, icon: 'MessageCircle', action: 'whatsapp' },
    { id: 'contactar_especialista', label: t.menu.contactarEspecialista, icon: 'Headset', action: 'contact' },
    { id: 'centro_ayuda', label: t.menu.centroAyuda, icon: 'HelpCircle', path: '/ayuda' }
  ];
};