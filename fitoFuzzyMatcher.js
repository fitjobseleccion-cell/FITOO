import Fuse from 'fuse.js';
import { FITO_INTENTIONS } from './fitoIntentions.js';

let fuseInstance = null;
let currentThreshold = 0.4;

export const adjustFuzzyThreshold = (threshold) => {
  currentThreshold = Math.max(0.0, Math.min(1.0, threshold));
  if (fuseInstance) {
    createFuzzyMatcher(currentThreshold);
  }
};

export const createFuzzyMatcher = (threshold = currentThreshold) => {
  const list = Object.values(FITO_INTENTIONS).map(intent => ({
    id: intent.id,
    synonyms: intent.synonyms
  }));

  const options = {
    includeScore: true,
    threshold: threshold,
    keys: ['synonyms']
  };

  fuseInstance = new Fuse(list, options);
  return fuseInstance;
};

export const findIntentionByFuzzyMatch = (text) => {
  if (!fuseInstance) {
    createFuzzyMatcher();
  }

  const normalizedText = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const results = fuseInstance.search(normalizedText);

  if (results.length > 0) {
    // Return the best match
    const bestMatchId = results[0].item.id;
    return FITO_INTENTIONS[bestMatchId];
  }

  return null;
};