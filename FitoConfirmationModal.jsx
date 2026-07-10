import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

const FitoConfirmationModal = ({ title, data, onConfirm, onEdit, isLoading }) => {
  return (
    <div 
      className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fito-confirmation-title"
    >
      <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
        
        <div className="p-4 border-b border-border flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-primary" aria-hidden="true" />
          </div>
          <div>
            <h3 id="fito-confirmation-title" className="font-semibold text-foreground text-base">
              {title}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Revisa los datos antes de proceder
            </p>
          </div>
        </div>

        <div className="p-4 bg-muted/40 flex-1 overflow-y-auto max-h-64 custom-scrollbar">
          <dl className="space-y-3">
            {Object.entries(data).map(([key, value]) => {
              if (value === undefined || value === '' || typeof value === 'boolean') return null;
              return (
                <div key={key}>
                  <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    {key.replace(/_/g, ' ')}
                  </dt>
                  <dd className="text-sm text-foreground font-medium break-words">
                    {value}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>

        <div className="p-4 border-t border-border flex gap-3 justify-end bg-card">
          <Button 
            variant="outline" 
            onClick={onEdit}
            disabled={isLoading}
            className="flex-1"
            aria-label="Volver para editar datos"
          >
            Editar
          </Button>
          <Button 
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1"
            aria-label="Confirmar y enviar datos"
          >
            {isLoading ? 'Procesando...' : 'Confirmar y enviar'}
          </Button>
        </div>

      </div>
    </div>
  );
};

export default FitoConfirmationModal;