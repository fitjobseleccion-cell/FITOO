import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

const SecurityBadges = () => {
  return (
    <div className="mt-8 flex flex-col items-center justify-center gap-4 p-6 bg-muted/30 rounded-2xl border border-border/50">
      <div className="flex flex-wrap justify-center gap-6 items-center">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Lock className="w-5 h-5 text-slate-400" />
          <span>Pago 100% Seguro</span>
        </div>
        <div className="w-px h-6 bg-border hidden sm:block"></div>
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <ShieldCheck className="w-5 h-5 text-slate-400" />
          <span>Certificado SSL / HTTPS</span>
        </div>
        <div className="w-px h-6 bg-border hidden sm:block"></div>
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <span className="font-bold text-slate-600 tracking-tighter text-lg">stripe</span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground text-center max-w-md">
        Tus datos están protegidos. Utilizamos encriptación de grado bancario para asegurar que tu información personal y de pago esté siempre segura.
      </p>
    </div>
  );
};

export default SecurityBadges;