import { FITO_TRANSLATIONS } from './fitoTranslations.js';

export const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 20) return 'afternoon';
  return 'evening';
};

const getRandomVariant = (variantsArray) => {
  if (!variantsArray || variantsArray.length === 0) return '';
  const randomIndex = Math.floor(Math.random() * variantsArray.length);
  return variantsArray[randomIndex];
};

export const getWelcomeMessage = (lang = 'es') => {
  const timeOfDay = getTimeOfDay();
  const t = FITO_TRANSLATIONS[lang]?.toneVariants?.welcome?.[timeOfDay] || FITO_TRANSLATIONS['es'].toneVariants.welcome[timeOfDay];
  return getRandomVariant(t);
};

export const getCompletionMessage = (action, lang = 'es') => {
  const t = FITO_TRANSLATIONS[lang]?.toneVariants?.completion || FITO_TRANSLATIONS['es'].toneVariants.completion;
  return getRandomVariant(t).replace('{action}', action);
};

export const getClosingMessage = (lang = 'es') => {
  const t = FITO_TRANSLATIONS[lang]?.toneVariants?.closing || FITO_TRANSLATIONS['es'].toneVariants.closing;
  return getRandomVariant(t);
};

export const getEncouragementMessage = (lang = 'es') => {
  const t = FITO_TRANSLATIONS[lang]?.toneVariants?.encouragement || FITO_TRANSLATIONS['es'].toneVariants.encouragement;
  return getRandomVariant(t);
};