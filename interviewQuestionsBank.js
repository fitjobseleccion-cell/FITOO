/**
 * @fileoverview Knowledge base for the Interview Simulator AI function.
 */

/**
 * Interview questions categorized by job position.
 * Each position contains exactly 8 questions with expected keywords for auto-scoring.
 * @type {Object.<string, Array.<{id: string, text: string, keywords: string[]}>>}
 */
export const INTERVIEW_QUESTIONS_BY_POSITION = {
  camarero: [
    { id: 'c1', text: '¿Cómo manejas una queja de un cliente sobre la comida o el servicio?', keywords: ['escuchar', 'disculpa', 'solución', 'calma', 'empatía', 'encargado'] },
    { id: 'c2', text: 'Describe una situación en la que tuviste que atender muchas mesas a la vez.', keywords: ['priorizar', 'organización', 'equipo', 'calma', 'rapidez'] },
    { id: 'c3', text: '¿Qué experiencia tienes utilizando sistemas TPV o cajas registradoras?', keywords: ['tpv', 'caja', 'datáfono', 'cobro', 'ticket', 'agilidad'] },
    { id: 'c4', text: '¿Cómo garantizas que se respeten las alergias e intolerancias de un cliente?', keywords: ['preguntar', 'cocina', 'carta', 'ingredientes', 'precaución', 'alergia'] },
    { id: 'c5', text: 'Si ves a un compañero abrumado de trabajo, ¿cómo actúas?', keywords: ['ayudar', 'compañerismo', 'equipo', 'proactividad', 'coordinar'] },
    { id: 'c6', text: '¿Qué haces si un cliente te pide un plato que no está en la carta?', keywords: ['consultar', 'alternativa', 'cocina', 'amabilidad', 'sugerir'] },
    { id: 'c7', text: 'Describe cómo mantienes tu rango limpio durante un servicio de alta demanda.', keywords: ['limpieza', 'orden', 'bandeja', 'constancia', 'protocolo'] },
    { id: 'c8', text: '¿Cómo aplicas técnicas de upselling para aumentar el ticket medio?', keywords: ['recomendar', 'postre', 'bebida', 'sugerencia', 'venta', 'maridaje'] }
  ],
  cocinero: [
    { id: 'co1', text: '¿Qué medidas tomas para asegurar la seguridad alimentaria en la cocina?', keywords: ['limpieza', 'contaminación cruzada', 'etiquetas', 'fechas', 'temperatura', 'appcc'] },
    { id: 'co2', text: '¿Cómo reaccionas cuando falta un ingrediente clave en pleno servicio?', keywords: ['alternativa', 'comunicación', 'jefe', 'solución', 'creatividad'] },
    { id: 'co3', text: '¿Cómo organizas tu partida antes de que comience el servicio (mise en place)?', keywords: ['mise en place', 'preparación', 'orden', 'tiempos', 'limpieza'] },
    { id: 'co4', text: 'Describe una vez en la que un plato fue devuelto por el cliente.', keywords: ['calma', 'rehacer', 'disculpa', 'comprobar', 'crítica', 'rápido'] },
    { id: 'co5', text: '¿Cómo mantienes el control de las mermas y el escandallo?', keywords: ['aprovechar', 'peso', 'coste', 'control', 'receta', 'merma'] },
    { id: 'co6', text: '¿Cuál es tu método para trabajar bajo presión extrema durante los picos de trabajo?', keywords: ['concentración', 'comunicación', 'prioridades', 'ritmo', 'organización'] },
    { id: 'co7', text: '¿Qué harías si detectas que un alimento en la cámara está caducado?', keywords: ['desechar', 'registrar', 'jefe', 'revisar', 'protocolo'] },
    { id: 'co8', text: '¿Cómo te coordinas con el personal de sala para que los platos salgan a tiempo?', keywords: ['cantar', 'comandar', 'timbre', 'sincronización', 'equipo', 'sala'] }
  ],
  recepcionista: [
    { id: 'r1', text: '¿Cómo gestionas a un cliente que llega enfadado porque su reserva no aparece?', keywords: ['calma', 'sistema', 'solución', 'alternativa', 'disculpa', 'empatía'] },
    { id: 'r2', text: '¿Qué herramientas ofimáticas o software de gestión hotelera dominas?', keywords: ['excel', 'word', 'pms', 'opera', 'reservas', 'correo'] },
    { id: 'r3', text: '¿Cómo priorizas tus tareas si el teléfono suena mientras atiendes presencialmente?', keywords: ['prioridad', 'presencial', 'espera', 'cortesía', 'disculpa', 'atención'] },
    { id: 'r4', text: 'Un huésped solicita información turística local. ¿Cómo le asistes?', keywords: ['mapa', 'recomendación', 'transporte', 'eventos', 'ciudad', 'sonrisa'] },
    { id: 'r5', text: '¿Cómo manejas la confidencialidad y los datos personales de los clientes?', keywords: ['rgpd', 'privacidad', 'discreción', 'pantalla', 'seguridad', 'protección'] },
    { id: 'r6', text: 'Describe tu proceso al realizar un Check-in / Check-out rápido.', keywords: ['documentación', 'firma', 'pago', 'llave', 'explicar', 'factura'] },
    { id: 'r7', text: '¿Qué haces si ocurre una emergencia (ej. alarma de incendio) en el hotel?', keywords: ['protocolo', 'evacuación', 'calma', 'avisar', 'autoridades', 'seguridad'] },
    { id: 'r8', text: '¿Cómo reaccionas ante una solicitud poco común o difícil por parte de un huésped VIP?', keywords: ['esfuerzo', 'contactos', 'discreción', 'alternativas', 'solucionar', 'imposible'] }
  ],
  director_hotel: [
    { id: 'd1', text: '¿Qué estrategias implementarías para mejorar el RevPAR?', keywords: ['revpar', 'precios', 'ocupación', 'marketing', 'upselling', 'estrategia'] },
    { id: 'd2', text: 'Describe cómo motivas a tu equipo durante la temporada alta.', keywords: ['comunicación', 'reconocimiento', 'apoyo', 'liderazgo', 'ejemplo'] },
    { id: 'd3', text: '¿Cómo gestionas un presupuesto y controlas los costes operativos?', keywords: ['presupuesto', 'costes', 'análisis', 'proveedores', 'eficiencia', 'revisión'] },
    { id: 'd4', text: '¿Qué métricas financieras analizas diariamente o semanalmente?', keywords: ['adr', 'gop', 'ventas', 'cancelaciones', 'kpi', 'informe'] },
    { id: 'd5', text: 'Si las reseñas online caen en picado, ¿cómo abordas el problema?', keywords: ['revisar', 'reunión', 'plan de acción', 'respuesta', 'calidad', 'tripadvisor'] },
    { id: 'd6', text: '¿Cómo manejas la negociación con proveedores externos para mejorar márgenes?', keywords: ['contrato', 'volumen', 'alternativas', 'calidad', 'precio', 'largo plazo'] },
    { id: 'd7', text: 'Nárranos una crisis operativa grave y cómo la resolviste.', keywords: ['decisión', 'rapidez', 'comunicación', 'liderazgo', 'evaluación', 'impacto'] },
    { id: 'd8', text: '¿Qué importancia le das a la sostenibilidad y cómo la aplicas en el hotel?', keywords: ['energía', 'reciclaje', 'local', 'concienciación', 'certificación', 'ahorro'] }
  ],
  rrhh: [
    { id: 'rh1', text: '¿Qué métricas consideras más importantes para evaluar un proceso de selección?', keywords: ['tiempo', 'retención', 'coste', 'kpi', 'calidad', 'rotación'] },
    { id: 'rh2', text: '¿Cómo manejarías un conflicto grave entre dos empleados de distintos departamentos?', keywords: ['mediación', 'escucha', 'objetividad', 'reunión', 'acuerdo', 'seguimiento'] },
    { id: 'rh3', text: '¿Qué iniciativas propondrías para mejorar el clima laboral?', keywords: ['encuestas', 'eventos', 'flexibilidad', 'reconocimiento', 'feedback', 'bienestar'] },
    { id: 'rh4', text: '¿Cómo diseñas un plan de onboarding efectivo para una nueva incorporación?', keywords: ['bienvenida', 'manual', 'mentor', 'seguimiento', 'cultura', 'herramientas'] },
    { id: 'rh5', text: '¿Qué estrategias usas para atraer talento en perfiles muy demandados?', keywords: ['employer branding', 'linkedin', 'beneficios', 'oferta', 'headhunting', 'redes'] },
    { id: 'rh6', text: '¿Cómo comunicas un despido a un empleado?', keywords: ['respeto', 'directo', 'privacidad', 'documentación', 'apoyo', 'legalidad'] },
    { id: 'rh7', text: '¿Qué importancia le das a la evaluación del desempeño y cómo la mides?', keywords: ['objetivos', 'reunión', 'crecimiento', 'feedback', '360', 'competencias'] },
    { id: 'rh8', text: '¿Cómo aseguras el cumplimiento de la normativa laboral vigente en la empresa?', keywords: ['convenio', 'ley', 'asesoría', 'actualización', 'contratos', 'prevención'] }
  ],
  comercial: [
    { id: 'cm1', text: 'Describe una venta difícil que lograste cerrar. ¿Cómo lo hiciste?', keywords: ['necesidad', 'objeciones', 'persistencia', 'valor', 'beneficio', 'negociación'] },
    { id: 'cm2', text: '¿Cómo prospectas nuevos clientes en un mercado competitivo?', keywords: ['networking', 'linkedin', 'puerta fría', 'crm', 'referencias', 'investigación'] },
    { id: 'cm3', text: '¿Qué haces cuando no estás alcanzando tus objetivos mensuales?', keywords: ['análisis', 'acción', 'contactos', 'estrategia', 'esfuerzo', 'supervisor'] },
    { id: 'cm4', text: '¿Qué proceso sigues para mantener y fidelizar a tu cartera de clientes actual?', keywords: ['seguimiento', 'llamadas', 'reuniones', 'confianza', 'postventa', 'novedades'] },
    { id: 'cm5', text: '¿Cómo te preparas antes de tener la primera reunión con un cliente potencial?', keywords: ['investigar', 'empresa', 'necesidades', 'competencia', 'presentación', 'preguntas'] },
    { id: 'cm6', text: '¿Qué software CRM has utilizado y cómo te ayuda en tu día a día?', keywords: ['salesforce', 'hubspot', 'pipeline', 'embudo', 'registro', 'tareas'] },
    { id: 'cm7', text: '¿Cómo reaccionas cuando un cliente te dice que tu producto/servicio es muy caro?', keywords: ['valor', 'roi', 'diferenciación', 'retorno', 'entender', 'beneficios'] },
    { id: 'cm8', text: 'Describe cómo trabajas en colaboración con el departamento de marketing.', keywords: ['leads', 'feedback', 'campañas', 'mensajes', 'alineación', 'mercado'] }
  ],
  administrativo: [
    { id: 'a1', text: '¿Cómo garantizas que no haya errores al introducir grandes volúmenes de datos?', keywords: ['revisión', 'doble check', 'concentración', 'fórmulas', 'validación', 'detalle'] },
    { id: 'a2', text: 'Si tienes tres tareas urgentes asignadas por tres jefes distintos, ¿cómo actúas?', keywords: ['priorizar', 'comunicación', 'impacto', 'fechas', 'coordinación', 'transparencia'] },
    { id: 'a3', text: '¿Qué experiencia tienes gestionando facturación y control de pagos?', keywords: ['facturas', 'erp', 'contabilidad', 'reclamación', 'vencimientos', 'excel'] },
    { id: 'a4', text: '¿Cómo organizas y mantienes el archivo documental de la oficina?', keywords: ['digitalización', 'carpetas', 'orden', 'nomenclatura', 'nube', 'seguridad'] },
    { id: 'a5', text: 'Describe una situación en la que mejoraste un proceso administrativo.', keywords: ['optimizar', 'tiempo', 'plantilla', 'automatizar', 'propuesta', 'eficiencia'] },
    { id: 'a6', text: '¿Cómo manejas la atención telefónica y derivación de llamadas?', keywords: ['filtro', 'amabilidad', 'mensaje', 'rapidez', 'agenda', 'registro'] },
    { id: 'a7', text: '¿Qué nivel de Excel posees y qué funciones utilizas habitualmente?', keywords: ['tablas dinámicas', 'buscarv', 'macros', 'macros', 'gráficos', 'fórmulas'] },
    { id: 'a8', text: '¿Cómo actúas ante el manejo de información confidencial de la empresa?', keywords: ['discreción', 'contraseñas', 'protección', 'rgpd', 'normativa', 'prudencia'] }
  ]
};

/**
 * Validation thresholds and weights for answer scoring.
 * @type {Object}
 */
export const INTERVIEW_SCORING_RULES = {
  minWordCount: 15,
  weights: {
    keyword: 0.40,
    completeness: 0.30,
    extension: 0.30
  }
};