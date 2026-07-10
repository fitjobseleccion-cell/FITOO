import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, BarChart3, Target, Settings, X, Lock } from 'lucide-react';
import { useConsentContext } from '../contexts/CookieConsentContext.jsx';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const CookiePreferencesModal = () => {
  const { showPreferences, closePreferences, preferences, savePreferences, acceptAll, rejectAll } = useConsentContext();
  
  // Local state for the modal toggles before saving
  const [localPrefs, setLocalPrefs] = useState(preferences);

  useEffect(() => {
    if (showPreferences) {
      setLocalPrefs(preferences);
      // Lock scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showPreferences, preferences]);

  if (!showPreferences) return null;

  const handleToggle = (key) => {
    if (key === 'necessary') return; // Cannot toggle necessary
    setLocalPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    savePreferences(localPrefs);
    toast.success('Preferencias de cookies guardadas');
    closePreferences();
  };

  const handleAcceptAll = () => {
    acceptAll();
    toast.success('Has aceptado todas las cookies');
  };

  const handleRejectAll = () => {
    rejectAll();
    toast.success('Has rechazado las cookies opcionales');
  };

  const categories = [
    {
      id: 'necessary',
      title: 'Estrictamente Necesarias',
      icon: Shield,
      required: true,
      description: 'Son fundamentales para que la web funcione correctamente. Permiten funciones básicas como la navegación, seguridad y accesibilidad.',
      examples: 'Sesión de usuario, preferencias de privacidad, seguridad.'
    },
    {
      id: 'analytics',
      title: 'Analíticas',
      icon: BarChart3,
      required: false,
      description: 'Nos ayudan a comprender cómo interactúan los visitantes con nuestra web, recopilando y reportando información de forma anónima.',
      examples: 'Google Analytics, páginas visitadas, tiempo en el sitio.'
    },
    {
      id: 'marketing',
      title: 'Marketing y Publicidad',
      icon: Target,
      required: false,
      description: 'Se utilizan para rastrear a los visitantes en las páginas web. La intención es mostrar anuncios relevantes y atractivos para el usuario individual.',
      examples: 'Facebook Pixel, anuncios personalizados, seguimiento de campañas.'
    },
    {
      id: 'functional',
      title: 'Funcionales',
      icon: Settings,
      required: false,
      description: 'Permiten que el sitio web recuerde información que cambia la forma en que se comporta o se ve el sitio.',
      examples: 'Preferencia de idioma, región, recordatorio de chats.'
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 animate-overlay-fade bg-slate-950/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-card w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-border"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Preferencias de Cookies</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Configura qué cookies quieres permitir. Para más detalles, lee nuestra <a href="/cookie-policy" className="text-primary hover:underline">Política de Cookies</a>.
              </p>
            </div>
            <button 
              onClick={closePreferences}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted text-muted-foreground transition-colors shrink-0"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isChecked = cat.required ? true : localPrefs[cat.id];
              
              return (
                <div key={cat.id} className="bg-background border border-border rounded-xl p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                        isChecked ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                      )}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                          {cat.title}
                          {cat.required && <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground uppercase tracking-wider">Siempre Activas</span>}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 mb-2 leading-relaxed">
                          {cat.description}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                          <span className="text-foreground">Ejemplos:</span> {cat.examples}
                        </p>
                      </div>
                    </div>
                    
                    {/* Custom Toggle Switch */}
                    <div className="shrink-0 pt-1">
                      {cat.required ? (
                        <div className="w-12 h-6 rounded-full bg-primary/50 flex items-center px-1 cursor-not-allowed">
                          <div className="w-4 h-4 rounded-full bg-white ml-auto flex items-center justify-center shadow-sm">
                            <Lock className="w-2.5 h-2.5 text-primary/70" />
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleToggle(cat.id)}
                          className={cn(
                            "w-12 h-6 rounded-full transition-colors duration-200 ease-in-out relative flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                            isChecked ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"
                          )}
                          role="switch"
                          aria-checked={isChecked}
                        >
                          <span 
                            className={cn(
                              "w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out inline-block absolute",
                              isChecked ? "translate-x-[26px]" : "translate-x-1"
                            )}
                          />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="border-t border-border p-6 bg-muted/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground w-full sm:w-auto text-center sm:text-left">
              <a href="/privacy-policy" className="hover:text-primary transition-colors hover:underline">Política de Privacidad</a>
              <span className="mx-2">•</span>
              <a href="/cookie-policy" className="hover:text-primary transition-colors hover:underline">Política de Cookies</a>
            </div>
            
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 w-full sm:w-auto">
              <Button 
                variant="outline" 
                onClick={handleRejectAll}
                className="w-full sm:w-auto text-muted-foreground"
              >
                Rechazar todas
              </Button>
              <Button 
                onClick={handleAcceptAll}
                className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Aceptar todas
              </Button>
              <Button 
                onClick={handleSave}
                className="w-full sm:w-auto bg-foreground text-background hover:bg-foreground/90"
              >
                Guardar preferencias
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CookiePreferencesModal;