import React, { createContext, useContext, useState, useEffect } from 'react';

const CookieConsentContext = createContext(null);

export const useConsentContext = () => {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error('useConsentContext must be used within a CookieConsentProvider');
  }
  return context;
};

const CONSENT_KEY = 'fitjob_cookie_consent';

const DEFAULT_PREFERENCES = {
  necessary: true, // Always true, cannot be changed
  analytics: false,
  marketing: false,
  functional: false,
  timestamp: null
};

export const CookieConsentProvider = ({ children }) => {
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [hasConsented, setHasConsented] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure necessary is always true, merge with stored
        setPreferences({ ...DEFAULT_PREFERENCES, ...parsed, necessary: true });
        setHasConsented(true);
      }
    } catch (e) {
      console.error('Error reading cookie preferences', e);
    }
    setIsInitialized(true);
  }, []);

  const savePreferences = (newPreferences) => {
    const prefsToSave = {
      ...DEFAULT_PREFERENCES,
      ...newPreferences,
      necessary: true,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(CONSENT_KEY, JSON.stringify(prefsToSave));
    setPreferences(prefsToSave);
    setHasConsented(true);
  };

  const acceptAll = () => {
    savePreferences({
      analytics: true,
      marketing: true,
      functional: true
    });
    setShowPreferences(false);
  };

  const rejectAll = () => {
    savePreferences({
      analytics: false,
      marketing: false,
      functional: false
    });
    setShowPreferences(false);
  };

  const openPreferences = () => setShowPreferences(true);
  const closePreferences = () => setShowPreferences(false);

  return (
    <CookieConsentContext.Provider value={{
      preferences,
      hasConsented,
      showPreferences,
      isInitialized,
      savePreferences,
      acceptAll,
      rejectAll,
      openPreferences,
      closePreferences
    }}>
      {children}
    </CookieConsentContext.Provider>
  );
};