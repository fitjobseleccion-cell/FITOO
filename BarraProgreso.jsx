import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  { id: 1, title: 'Empresa' },
  { id: 2, title: 'Oferta' },
  { id: 3, title: 'Candidato' },
  { id: 4, title: 'Revisión' }
];

const BarraProgreso = ({ currentStep }) => {
  return (
    <div className="w-full mb-8">
      {/* Desktop Horizontal Progress */}
      <div className="hidden md:flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted rounded-full -z-10"></div>
        
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full -z-10 transition-all duration-500 ease-in-out"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          
          return (
            <div key={step.id} className="flex flex-col items-center gap-2 relative bg-card px-2">
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-sm",
                  isCompleted ? "bg-primary text-primary-foreground scale-105" : 
                  isCurrent ? "bg-primary/20 text-primary border-2 border-primary" : 
                  "bg-muted text-muted-foreground border-2 border-transparent"
                )}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : step.id}
              </div>
              <span className={cn(
                "text-sm font-semibold transition-colors duration-300",
                isCompleted ? "text-foreground" : 
                isCurrent ? "text-primary" : 
                "text-muted-foreground"
              )}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile Vertical Progress */}
      <div className="flex flex-col md:hidden gap-4">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isPending = currentStep < step.id;
          
          return (
            <div key={step.id} className="flex items-center gap-4 relative">
              {index !== steps.length - 1 && (
                <div className={cn(
                  "absolute left-[19px] top-10 bottom-[-16px] w-0.5",
                  isCompleted ? "bg-primary" : "bg-muted"
                )}></div>
              )}
              
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm z-10 shrink-0 transition-all duration-300",
                  isCompleted ? "bg-primary text-primary-foreground" : 
                  isCurrent ? "bg-primary/20 text-primary border-2 border-primary" : 
                  "bg-muted text-muted-foreground border-2 border-transparent"
                )}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : step.id}
              </div>
              
              <div className="flex-1 pb-1">
                <span className={cn(
                  "text-base font-semibold",
                  isCompleted ? "text-foreground" : 
                  isCurrent ? "text-primary" : 
                  "text-muted-foreground"
                )}>
                  {step.title}
                </span>
                {isCurrent && (
                  <p className="text-xs text-muted-foreground mt-0.5">Paso actual</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BarraProgreso;