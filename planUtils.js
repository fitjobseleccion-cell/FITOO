export const PLAN_CONFIG = [
  {
    id: 'gratis',
    name: 'Plan Gratuito',
    priceLabel: 'Gratis',
    price: 0,
    description: 'Perfecto para comenzar. Acceso limitado a las funcionalidades básicas.',
    limite_ofertas: 1,
    limite_candidatos: 5,
    features: [
      'Publicación de 1 oferta.',
      'Hasta 5 candidatos.',
      'Publicación en la web de FITJOB.',
      'Soporte por email.',
      'Acceso básico a herramientas.'
    ],
    buttonText: 'Plan Actual',
    recommended: false
  },
  {
    id: 'basico',
    name: 'Plan Básico',
    priceLabel: '36,50 €',
    price: 36.50,
    description: 'Ideal para empresas que prefieren gestionar directamente las candidaturas y el proceso de selección.',
    limite_ofertas: 2,
    limite_candidatos: 38,
    features: [
      'Publicación de hasta 2 ofertas.',
      'Hasta 38 candidatos.',
      'Publicación de las ofertas en la web de FITJOB.',
      'Difusión en redes sociales.',
      'Soporte por email.'
    ],
    buttonText: 'Contratar Plan Básico',
    recommended: false
  },
  {
    id: 'empresa',
    name: 'Plan Empresa',
    priceLabel: '59,00 €',
    price: 59.00,
    description: 'Perfecto para empresas con mayor volumen de contratación que desean gestionar internamente el proceso de selección.',
    limite_ofertas: 3,
    limite_candidatos: 60,
    features: [
      'Publicación de hasta 3 ofertas.',
      'Hasta 60 candidatos.',
      'Publicación de las ofertas en la web de FITJOB.',
      'Difusión en redes sociales.',
      'Soporte prioritario.'
    ],
    buttonText: 'Contratar Plan Empresa',
    recommended: true
  },
  {
    id: 'proceso_seleccion',
    name: 'Proceso de Selección',
    priceLabel: '179,69 €',
    price: 179.69,
    description: 'Nosotros realizamos todo el proceso de selección para que la empresa solo tenga que entrevistar a los mejores candidatos.',
    limite_ofertas: 5,
    limite_candidatos: 999,
    features: [
      'Selección completa realizada por FITJOB.',
      'Publicación de las ofertas en la web de FITJOB.',
      'Difusión en redes sociales.',
      'Criba curricular de candidatos.',
      'Entrevistas realizadas por nuestro equipo.',
      'Presentación de candidatos finalistas previamente evaluados.'
    ],
    buttonText: 'Solicitar Proceso de Selección',
    recommended: false,
    highlightedText: 'La opción más cómoda y eficiente: ahorra tiempo, reduce el esfuerzo de tu equipo y recibe únicamente los perfiles que mejor encajan con tu vacante.'
  }
];

export const getDaysUntilExpiration = (expirationDate) => {
  const today = new Date();
  const expDate = new Date(expirationDate);
  const diffTime = Math.abs(expDate - today);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const shouldNotifyExpiration = (expirationDate) => {
  const daysLeft = getDaysUntilExpiration(expirationDate);
  return daysLeft <= 7;
};