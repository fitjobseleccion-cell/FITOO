export const FITO_INTENTIONS = {
  buscar_empleo: {
    id: 'buscar_empleo',
    label: 'Buscar empleo',
    synonyms: ['buscar trabajo', 'encontrar empleo', 'ofertas', 'quiero trabajar', 'busco curro', 'vacantes', 'empleo'],
    action: 'navigate',
    target: '/ofertas-de-trabajo'
  },
  crear_cv: {
    id: 'crear_cv',
    label: 'Crear CV',
    synonyms: ['hacer curriculum', 'crear cv', 'nuevo curriculum', 'redactar cv', 'hacer cv'],
    action: 'navigate',
    target: '/cv-generator'
  },
  ver_cursos: {
    id: 'ver_cursos',
    label: 'Ver cursos',
    synonyms: ['estudiar', 'aprender', 'cursos', 'formacion', 'capacitacion'],
    action: 'navigate',
    target: '/cursos'
  },
  subir_cv: {
    id: 'subir_cv',
    label: 'Subir CV',
    synonyms: ['cargar curriculum', 'subir cv', 'enviar curriculum', 'adjuntar cv'],
    action: 'navigate',
    target: '/panel-candidato'
  },
  soy_empresa: {
    id: 'soy_empresa',
    label: 'Soy empresa',
    synonyms: ['publicar oferta', 'soy empresa', 'buscar candidatos', 'contratar', 'reclutar'],
    action: 'navigate',
    target: '/panel-empresa'
  },
  whatsapp: {
    id: 'whatsapp',
    label: 'WhatsApp',
    synonyms: ['hablar por whatsapp', 'escribir al whatsapp', 'chat whatsapp', 'wa'],
    action: 'whatsapp',
    target: null
  },
  contactar_especialista: {
    id: 'contactar_especialista',
    label: 'Contactar especialista',
    synonyms: ['hablar con humano', 'soporte', 'ayuda persona', 'especialista', 'asesor'],
    action: 'view',
    target: 'contact'
  },
  centro_ayuda: {
    id: 'centro_ayuda',
    label: 'Centro de ayuda',
    synonyms: ['ayuda', 'faq', 'preguntas frecuentes', 'como funciona', 'dudas'],
    action: 'navigate',
    target: '/ayuda'
  },
  analizar_cv: {
    id: 'analizar_cv',
    label: 'Analizar CV',
    synonyms: ['revisar cv', 'analizar curriculum', 'mejorar cv', 'puntuacion cv', 'ats'],
    action: 'view',
    target: 'analyze_cv'
  },
  generar_carta: {
    id: 'generar_carta',
    label: 'Generar carta',
    synonyms: ['carta de presentacion', 'escribir carta', 'redactar carta', 'cover letter'],
    action: 'view',
    target: 'generate_letter'
  },
  practicar_entrevista: {
    id: 'practicar_entrevista',
    label: 'Practicar entrevista',
    synonyms: ['simular entrevista', 'practicar', 'entrevista', 'preguntas entrevista', 'preparar entrevista'],
    action: 'view',
    target: 'practice_interview'
  }
};

export const getIntentionByText = (text) => {
  const normalizedText = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  for (const key in FITO_INTENTIONS) {
    const intention = FITO_INTENTIONS[key];
    if (intention.synonyms.some(syn => normalizedText.includes(syn))) {
      return intention;
    }
  }
  return null;
};