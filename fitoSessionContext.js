const SESSION_KEY = 'fito_session_context';

export const createSessionContext = () => {
  const existing = sessionStorage.getItem(SESSION_KEY);
  if (!existing) {
    const initialContext = {
      jobSearchPreferences: {},
      diagnosisResults: null,
      interviewScores: [],
      cvAnalysis: null,
      coverLetterData: {},
      userPreferences: {}
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(initialContext));
    return initialContext;
  }
  return JSON.parse(existing);
};

export const updateSessionContext = (key, value) => {
  const context = createSessionContext();
  context[key] = { ...context[key], ...value };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(context));
  return context;
};

export const getSessionContext = () => {
  return createSessionContext();
};