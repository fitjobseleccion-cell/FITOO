import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const FormSection = ({ 
  title, 
  icon: Icon, 
  isOpen, 
  onToggle, 
  isCompleted, 
  children,
  stepNumber
}) => {
  return (
    <div className={cn(
      "mb-6 rounded-2xl border-2 overflow-hidden transition-all duration-300 bg-card",
      isOpen ? "border-primary shadow-md" : "border-border shadow-sm hover:border-primary/50",
      isCompleted && !isOpen ? "border-green-200 bg-green-50/30" : ""
    )}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-6 py-5 flex items-center justify-between bg-transparent outline-none"
      >
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
            isOpen ? "bg-primary/10 text-primary" : 
            isCompleted ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"
          )}>
            {isCompleted && !isOpen ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
          </div>
          <div className="text-left">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
              Paso {stepNumber}
            </span>
            <h3 className={cn(
              "text-lg font-bold transition-colors",
              isOpen ? "text-primary" : "text-foreground"
            )}>
              {title}
            </h3>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
            isOpen ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
          )}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6 pt-2 border-t border-border/50">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormSection;