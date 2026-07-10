import React from 'react';

const PageLoader = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center w-full">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-16 h-16 flex items-center justify-center bg-primary/5 rounded-2xl overflow-hidden shadow-inner border border-primary/10">
          <div className="absolute inset-0 bg-primary/20 animate-pulse-glow"></div>
          <span className="text-2xl font-extrabold text-primary tracking-tighter relative z-10">FJ</span>
        </div>
        <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 bg-primary animate-loader-progress rounded-full"></div>
        </div>
        <p className="text-sm font-medium text-slate-400 animate-pulse">Cargando experiencia...</p>
      </div>
    </div>
  );
};

export default PageLoader;