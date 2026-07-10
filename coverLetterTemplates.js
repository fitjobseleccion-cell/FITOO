/**
 * @fileoverview Templates and dynamic paragraphs for the Cover Letter Generator.
 */

/**
 * Structure templates for different tones. 
 * Variables like {empresa} are replaced at runtime.
 * @type {Object.<string, string>}
 */
export const COVER_LETTER_TEMPLATES = {
  formal: `Estimado/a responsable de selección,

Le escribo para presentar mi candidatura al puesto de {puesto} en {empresa}. A lo largo de mi trayectoria profesional, he desarrollado habilidades que encajan perfectamente con los requisitos de la oferta.

{parrafo_experiencia_especifica}

Cuento con {años_experiencia} de experiencia demostrable, periodo en el cual he logrado aportar valor y alcanzar los objetivos propuestos. Mi enfoque se centra en la mejora continua y en aportar soluciones eficientes a los retos diarios.

Me encantaría tener la oportunidad de conversar en una entrevista para detallar cómo puedo contribuir al éxito de {empresa}.

Atentamente,
{nombre_candidato}`,

  cercana: `¡Hola, equipo de {empresa}!

He visto la vacante para {puesto} y no he dudado en inscribirme. Conozco el trabajo que hacéis en {empresa} y me motiva mucho la posibilidad de aportar mi granito de arena.

{parrafo_experiencia_especifica}

Llevo {años_experiencia} dedicándome a esto, aprendiendo cada día y disfrutando del trabajo en equipo. Soy una persona proactiva, me adapto rápido a los cambios y me gusta hacer las cosas con pasión.

Espero que mi perfil encaje con lo que buscáis. Estaré encantado/a de ampliar cualquier información en una entrevista.

Un saludo,
{nombre_candidato}`,

  directo: `A la atención del equipo de reclutamiento de {empresa}:

Me dirijo a ustedes para postularme a la vacante de {puesto}. Soy un/a profesional orientado/a a resultados, con {años_experiencia} de experiencia comprobable en el sector.

{parrafo_experiencia_especifica}

Mi objetivo principal es integrarme en {empresa} para aportar mi experiencia técnica y habilidades interpersonales desde el primer día. Mi trayectoria demuestra capacidad para asumir responsabilidades y alcanzar metas específicas.

Quedo a su disposición para concertar una entrevista.

Saludos cordiales,
{nombre_candidato}`
};

/**
 * Sector-specific paragraphs injected into the {parrafo_experiencia_especifica} variable.
 * @type {Object.<string, string>}
 */
export const EXPERIENCE_PARAGRAPHS_BY_SECTOR = {
  hosteleria: "Mi experiencia en el sector hostelero me ha dotado de una excelente capacidad de atención al cliente, manejo de situaciones bajo presión y conocimiento avanzado de los estándares de servicio.",
  administracion: "En mis roles administrativos anteriores, he perfeccionado mis habilidades de organización, gestión documental y dominio de herramientas ofimáticas y ERPs, garantizando la eficiencia operativa.",
  comercial: "Durante mi carrera en ventas, he demostrado habilidades sólidas de negociación, cierre de acuerdos y gestión de carteras de clientes, logrando consistentemente superar los KPIs establecidos.",
  rrhh: "Mi especialización en Recursos Humanos me ha permitido gestionar procesos integrales de selección, onboarding y desarrollo de talento, siempre con el foco en el bienestar del empleado y las necesidades de la empresa.",
  tecnologia: "Mi perfil técnico me permite desarrollar soluciones de software eficientes, escribir código limpio y colaborar estrechamente bajo metodologías ágiles para cumplir con los plazos de entrega.",
  educacion: "He desarrollado e impartido planes de estudio adaptados a diversas necesidades, fomentando un entorno de aprendizaje inclusivo, dinámico y enfocado en el desarrollo integral del alumno.",
  sanidad: "Mi vocación por el cuidado del paciente me ha llevado a trabajar bajo estrictos protocolos sanitarios, manteniendo la calma en urgencias y asegurando siempre la mayor calidad asistencial."
};

/**
 * Metadata for the tone selector UI tabs.
 * @type {Array.<{id: string, label: string, description: string}>}
 */
export const TONE_VARIANTS = [
  { id: 'formal', label: 'Formal', description: 'Ideal para empresas corporativas y tradicionales' },
  { id: 'cercana', label: 'Cercana', description: 'Perfecta para startups y empresas modernas' },
  { id: 'directo', label: 'Directa', description: 'Para ir al grano, destacando logros e impacto' }
];