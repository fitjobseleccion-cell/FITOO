import React from 'react';
import { Bot } from 'lucide-react';
import { getAriaLabel } from '@/lib/fitoAccessibility.js';

const FitoTypingIndicator = () => {
  return (
    <div className="flex gap-3 max-w-[85%] animate-in fade-in duration-300">
      <div 
        className="w-8 h-8 rounded-full bg-[hsl(var(--fito-primary))]/10 flex items-center justify-center flex-shrink-0"
        aria-hidden="true"
      >
        <Bot className="w-5 h-5 text-[hsl(var(--fito-primary))]" />
      </div>
      
      <div 
        className="px-4 py-3 bg-card border border-border rounded-2xl rounded-tl-sm shadow-sm flex items-center justify-center min-w-[60px]"
        role="status" 
        aria-label={getAriaLabel('typingIndicator')} 
        aria-live="polite"
      >
        <div className="flex items-center gap-1.5 h-4">
          <span 
            className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" 
            style={{ animationDelay: '0ms', animationDuration: '1s' }} 
          />
          <span 
            className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" 
            style={{ animationDelay: '150ms', animationDuration: '1s' }} 
          />
          <span 
            className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" 
            style={{ animationDelay: '300ms', animationDuration: '1s' }} 
          />
        </div>
        <span className="sr-only">FITO está escribiendo...</span>
      </div>
    </div>
  );
};

export default FitoTypingIndicator;