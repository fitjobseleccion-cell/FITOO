import React from 'react';
import { Info, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FitoContextualGreeting = ({ context, onAction, onBackToMenu }) => {
  if (!context) return null;

  return (
    <div 
      className="p-4 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
      role="status"
      aria-live="polite"
      aria-label="Sugerencias contextuales de FITO"
    >
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 flex gap-3">
        <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <h4 className="font-semibold text-sm text-primary mb-1">{context.title}</h4>
          <p className="text-xs text-foreground/80 leading-relaxed">
            {context.message}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1">
          Sugerencias rápidas
        </p>
        <ul className="space-y-2" aria-label="Lista de acciones rápidas">
          {context.quickActions.map((actionBtn, idx) => (
            <li key={idx}>
              <Button
                variant="outline"
                className="w-full justify-between h-auto py-3 px-4 border-border bg-card hover:bg-muted hover:border-primary/50 text-left transition-colors"
                onClick={() => onAction(actionBtn)}
                aria-label={`Acción rápida: ${actionBtn.label}`}
              >
                <span className="text-sm font-medium text-foreground">{actionBtn.label}</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </Button>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-4 border-t border-border text-center">
        <button
          onClick={onBackToMenu}
          className="text-xs text-muted-foreground hover:text-foreground underline transition-colors"
          aria-label="Ver menú principal de opciones"
        >
          Ver menú principal
        </button>
      </div>
    </div>
  );
};

export default FitoContextualGreeting;