import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  tooltip,
  helperText,
  validate,
  className
}) => {
  const [isTouched, setIsTouched] = useState(false);
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (isTouched || value) {
      const validationError = validate ? validate(value) : (required && !value ? 'Este campo es obligatorio' : '');
      setError(validationError);
      setIsValid(!validationError && value.length > 0);
    }
  }, [value, isTouched, validate, required]);

  const handleBlur = () => {
    setIsTouched(true);
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center justify-between">
        <label htmlFor={name} className="text-sm font-semibold text-foreground flex items-center gap-2">
          {label} {required && <span className="text-destructive">*</span>}
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger type="button" tabIndex={-1}>
                  <Info className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-sm">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </label>
      </div>

      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={cn(
            "w-full h-11 px-4 !pr-11 rounded-lg border-2 bg-background text-foreground transition-all duration-200 outline-none",
            "focus:ring-2 focus:ring-offset-0",
            error 
              ? "border-destructive focus:border-destructive focus:ring-destructive/20" 
              : isValid 
                ? "border-green-500 focus:border-green-500 focus:ring-green-500/20" 
                : "border-input focus:border-primary focus:ring-primary/20"
          )}
        />
        
        {/* Validation Icons */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
          {isValid && <CheckCircle2 className="w-5 h-5 text-green-500 animate-fade-in" />}
          {error && <AlertCircle className="w-5 h-5 text-destructive animate-fade-in" />}
        </div>
      </div>

      {/* Error or Helper Text */}
      <div className="min-h-[20px]">
        {error ? (
          <p className="text-sm text-destructive animate-fade-in">{error}</p>
        ) : helperText ? (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        ) : null}
      </div>
    </div>
  );
};

export default FormInput;