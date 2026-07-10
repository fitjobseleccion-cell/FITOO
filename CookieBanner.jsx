import React from 'react';
import { useConsentContext } from '../contexts/CookieConsentContext.jsx';
import { Button } from '@/components/ui/button';
import { Cookie } from 'lucide-react';

const CookieBanner = () => {
  const { hasConsented, isInitialized, acceptAll, rejectAll, openPreferences } = useConsentContext();

  if (!isInitialized || hasConsented) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 pointer-events-none">
      <div className="mx-auto max-w-5xl w-full pointer-events-auto bg-card border border-border shadow-2xl rounded-2xl p-6 md:p-8 animate-slide-up-banner flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        
        <div className="flex-1 space-y-2">
          <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
            <Cookie className="w-6 h-6 text-primary" />
            Usamos cookies para mejorar tu experiencia
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-3xl">
            FITJOB utiliza cookies propias y de terceros para fines analíticos, funcionales y de marketing. Puedes aceptar todas las cookies, rechazarlas o configurar tus preferencias. Para más información, consulta nuestra{' '}
            <a href="/cookie-policy" className="text-primary font-medium hover:underline">Política de Cookies</a>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
          <Button 
            onClick={openPreferences} 
            variant="ghost" 
            className="text-muted-foreground hover:text-foreground"
          >
            Personalizar
          </Button>
          <Button 
            onClick={rejectAll} 
            variant="outline" 
            className="border-border hover:bg-muted"
          >
            Rechazar
          </Button>
          <Button 
            onClick={acceptAll} 
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Aceptar todas
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;