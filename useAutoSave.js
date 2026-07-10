import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

export const useAutoSave = (key, data, delay = 30000) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const initialRender = useRef(true);

  // Load initial data
  useEffect(() => {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed) {
          toast.info('Se han recuperado tus datos guardados automáticamente.');
        }
      } catch (e) {
        console.error('Failed to parse autosaved data', e);
      }
    }
  }, [key]);

  // Save data periodically when changed
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      setIsSaving(true);
      try {
        localStorage.setItem(key, JSON.stringify(data));
        setLastSaved(new Date());
        toast('Guardando...', { duration: 1000, position: 'bottom-right' });
      } catch (error) {
        console.error('Autosave failed', error);
      } finally {
        setTimeout(() => setIsSaving(false), 800);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [data, key, delay]);

  return { isSaving, lastSaved, clearSaved: () => localStorage.removeItem(key) };
};