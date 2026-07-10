/**
 * @fileoverview Configuration rules for the CV Analyzer AI function.
 * Exports dictionaries and scoring weights used to evaluate PDF resumes.
 */

/**
 * Maps industry sectors to their specific high-value keywords.
 * Used by CVAnalyzer to calculate the keyword density score.
 * @type {Object.<string, string[]>}
 */
export const CV_KEYWORDS_BY_SECTOR = {
  hosteleria: ['atención al cliente', 'tpv', 'inglés', 'bandeja', 'manipulador de alimentos', 'coctelería', 'servicios', 'protocolo', 'limpieza', 'gestión de quejas'],
  administracion: ['contabilidad', 'facturación', 'excel', 'erp', 'sap', 'gestión documental', 'atención telefónica', 'ofimática', 'nóminas', 'presupuestos'],
  comercial: ['ventas', 'b2b', 'b2c', 'crm', 'negociación', 'captación', 'fidelización', 'kpi', 'objetivos', 'cierre de ventas'],
  rrhh: ['selección', 'nóminas', 'onboarding', 'clima laboral', 'evaluación del desempeño', 'linkedin', 'atraccion de talento', 'formación', 'retribución'],
  tecnologia: ['javascript', 'react', 'python', 'sql', 'git', 'agile', 'scrum', 'bases de datos', 'api', 'desarrollo', 'aws', 'docker', 'arquitectura'],
  educacion: ['pedagogía', 'didáctica', 'programación didáctica', 'evaluación', 'tutoría', 'metodología', 'necesidades educativas', 'aula', 'e-learning'],
  sanidad: ['paciente', 'historia clínica', 'protocolo', 'triaje', 'urgencias', 'reanimación', 'cuidados', 'prevención', 'diagnóstico', 'terapia']
};

/**
 * List of strong action verbs used to evaluate the impact of experience descriptions.
 * @type {string[]}
 */
export const ACTION_VERBS = [
  'gestioné', 'lideré', 'coordiné', 'aumenté', 'desarrollé', 'mejoré', 'creé', 'optimicé', 'implementé', 'logré', 'dirigí', 'supervisé', 'diseñé', 'resolví', 'organicé', 'planifiqué', 'reduje', 'analicé', 'ejecuté', 'transformé'
];

/**
 * Standard headers expected in a well-structured CV.
 * @type {string[]}
 */
export const CV_SECTIONS = [
  'experiencia', 'formación', 'educación', 'habilidades', 'idiomas', 'perfil', 'sobre mi', 'contacto', 'conocimientos', 'certificaciones'
];

/**
 * Multipliers for the final ATS score calculation. Must sum to 1.0.
 * @type {Object.<string, number>}
 */
export const CV_SCORING_WEIGHTS = {
  structure: 0.30,
  contact: 0.20,
  keywords: 0.30,
  actionVerbs: 0.20
};