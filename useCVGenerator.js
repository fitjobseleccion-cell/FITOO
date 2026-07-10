import { useState, useCallback, useEffect, useRef } from 'react';
import { generatePdfFromElement } from '@/lib/cvPdfGenerator.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import apiServerClient from '@/lib/apiServerClient.js';

const initialData = {
  nombre: '',
  apellidos: '',
  puesto: '',
  telefono: '',
  email: '',
  ciudad: '',
  sobreMi: '',
  aptitudes: '',
  habilidades: '',
  experiencia: [{ id: Date.now().toString(), empresa: '', puesto: '', fechaInicio: '', fechaFin: '', funciones: '' }],
  educacion: [{ id: Date.now().toString(), centro: '', titulacion: '', fechaInicio: '', fechaFin: '' }],
  photo: null
};

export const useCVGenerator = () => {
  const { user } = useAuth();
  const [cvData, setCVDataState] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [saveStatus, setSaveStatus] = useState(''); // '', 'saving', 'saved', 'error'
  
  const isInitialLoad = useRef(true);
  const saveTimeoutRef = useRef(null);
  const isFirstRender = useRef(true);

  // Load draft on mount
  useEffect(() => {
    const loadDraft = async () => {
      if (!user) return;
      try {
        const res = await apiServerClient.fetch(`/cv-drafts/load?userId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.formData) {
            setCVDataState(prev => ({ ...prev, ...data.formData }));
          }
          if (data.paymentStatus === 'confirmed') {
            setIsPaid(true);
          }
        }
      } catch (err) {
        console.error('Error loading CV draft:', err);
      } finally {
        isInitialLoad.current = false;
      }
    };

    if (isFirstRender.current) {
      isFirstRender.current = false;
      loadDraft();
    }
  }, [user]);

  // Auto-save effect
  useEffect(() => {
    if (isInitialLoad.current || !user) return;

    setSaveStatus('saving');

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const payload = {
          userId: user.id,
          formData: cvData,
          paymentStatus: isPaid ? 'confirmed' : 'pending',
          serviceId: 'cv-automatico'
        };

        await apiServerClient.fetch('/cv-drafts/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        setSaveStatus('saved');
        
        // Clear 'saved' status after 3 seconds
        setTimeout(() => setSaveStatus(''), 3000);
      } catch (err) {
        console.error('Error auto-saving CV:', err);
        setSaveStatus('error');
      }
    }, 1000); // 1s debounce

    return () => clearTimeout(saveTimeoutRef.current);
  }, [cvData, isPaid, user]);

  const setCVData = useCallback((newData) => {
    setCVDataState(prev => ({ ...prev, ...newData }));
  }, []);

  const getCVData = useCallback(() => {
    return cvData;
  }, [cvData]);

  const resetForm = useCallback(() => {
    setCVDataState({ ...initialData, experiencia: [{ id: Date.now().toString(), empresa: '', puesto: '', fechaInicio: '', fechaFin: '', funciones: '' }], educacion: [{ id: (Date.now() + 1).toString(), centro: '', titulacion: '', fechaInicio: '', fechaFin: '' }] });
    setPdfUrl(null);
    setError(null);
  }, []);

  const handlePhotoUpload = useCallback((file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        resolve(null);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCVData({ photo: reader.result });
        resolve(reader.result);
      };
      reader.onerror = () => {
        setError('Error al procesar la imagen');
        reject(new Error('Error al procesar la imagen'));
      };
      reader.readAsDataURL(file);
    });
  }, [setCVData]);

  const generatePDF = useCallback(async (elementId, watermarkEnabled = true, filename = 'CV.pdf') => {
    setIsLoading(true);
    setError(null);
    try {
      const url = await generatePdfFromElement(elementId, watermarkEnabled);
      setPdfUrl(url);
      
      // Create a temporary link to download with specific filename
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
    } catch (err) {
      console.error(err);
      setError('Error al generar el PDF. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    cvData,
    setCVData,
    getCVData,
    resetForm,
    handlePhotoUpload,
    generatePDF,
    isLoading,
    pdfUrl,
    error,
    isPaid,
    setIsPaid,
    saveStatus
  };
};