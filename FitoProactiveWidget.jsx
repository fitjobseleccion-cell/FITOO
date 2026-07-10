import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils.js';

const FitoProactiveWidget = ({ trigger, onAction, onDismiss }) => {
  if (!trigger) return null;

  return (
    <div className="absolute bottom-20 right-0 mb-4 mr-4 z-40 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-card border shadow-lg rounded-2xl p-4 max-w-[280px] relative">
        <button 
          onClick={onDismiss}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Cerrar sugerencia"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex items-start gap-3">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
            trigger.type === 'warning' ? "bg-amber-100 text-amber-600" : "bg-primary/10 text-primary"
          )}>
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm text-foreground leading-snug pr-4">
              {trigger.message}
            </p>
            <Button 
              size="sm" 
              className="mt-3 w-full text-xs h-8" 
              onClick={() => onAction(trigger)}
            >
              {trigger.actionLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FitoProactiveWidget;