/**
 * @fileoverview Utility library for persisting FITO chat state to sessionStorage,
 * ensuring context and conversation history survive page reloads or accidental closure.
 */

const STORAGE_KEY = 'fito_chat_state';

/**
 * Saves current chat state to sessionStorage.
 * @param {Object} state - { isOpen, messages, currentStep, currentModule, scrollPosition, sessionContext }
 */
export const saveFitoState = (state) => {
  try {
    const payload = {
      ...state,
      timestamp: new Date().toISOString()
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.error('Error saving FITO state:', error);
  }
};

/**
 * Retrieves the saved FITO chat state from sessionStorage.
 * @returns {Object|null} The parsed state object or null if none/error.
 */
export const loadFitoState = () => {
  try {
    const data = sessionStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading FITO state:', error);
    return null;
  }
};

/**
 * Removes the saved FITO chat state from sessionStorage.
 */
export const clearFitoState = () => {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing FITO state:', error);
  }
};

/**
 * Wrapper function for restoring a state object, verifying expiration if needed.
 * Current implementation keeps it alive for the session's lifecycle.
 */
export const restoreFitoState = () => {
  return loadFitoState();
};