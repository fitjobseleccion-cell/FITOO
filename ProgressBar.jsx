import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const ProgressBar = ({ currentStep }) => {
  const steps = [
    { id: 1, label: 'Datos de la empresa' },
    { id: 2, label: 'Información de pago' },
    { id: 3, label: 'Confirmación' }
  ];

  const progressPercentage = Math.round((currentStep / steps.length) * 100);

  return (
    <div className="w-full py-6 mb-8">
      <div className="flex items-center justify-between relative">
        {/* Background Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted rounded-full z-0" />
        
        {/* Active Progress Line */}
        <motion.div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full z-0"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {/* Steps */}
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isUpcoming = currentStep < step.id;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted || isCurrent ? 'hsl(var(--primary))' : 'hsl(var(--background))',
                  borderColor: isCompleted || isCurrent ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                  color: isCompleted || isCurrent ? 'hsl(var(--primary-foreground))' : 'hsl(var(--muted-foreground))',
                  scale: isCurrent ? 1.1 : 1
                }}
                className={cn(
                  "w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-colors duration-300",
                  isUpcoming && "bg-background border-border text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : step.id}
              </motion.div>
              <span className={cn(
                "text-xs md:text-sm font-medium absolute -bottom-6 w-max text-center transition-colors duration-300",
                isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-10 text-center text-sm font-medium text-muted-foreground">
        Progreso: <span className="text-primary">{progressPercentage}%</span>
      </div>
    </div>
  );
};

export default ProgressBar;