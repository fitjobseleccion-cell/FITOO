import React from 'react';
import { Check, Star, AlertTriangle, CircleDot, Circle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ServiceSelectionStep = ({ selectedService, onServiceChange }) => {
  return (
    <div className="space-y-8">
      {/* Option 1: Complete Selection Service */}
      <Card 
        className={cn(
          "relative overflow-hidden cursor-pointer transition-all duration-300 border-2",
          selectedService === 'complete' ? "service-card-selected" : "border-border/50 hover:border-primary/50 bg-card"
        )}
        onClick={() => onServiceChange('complete')}
      >
        {/* ⭐ Recomendado badge */}
        {selectedService === 'complete' ? (
          <div className="service-badge">
            <Check className="w-3.5 h-3.5" /> Seleccionado
          </div>
        ) : (
          <div className="absolute top-0 right-0 bg-primary/10 text-primary px-4 py-1.5 rounded-bl-xl font-medium text-sm flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-current" /> Recomendado
          </div>
        )}

        <CardContent className="p-6 md:p-8 relative">
          <div className="flex items-start gap-4">
            <div className="mt-1 shrink-0">
              {selectedService === 'complete' ? (
                <CircleDot className="w-6 h-6 text-primary" />
              ) : (
                <Circle className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 space-y-5">
              <div className="pr-24">
                <h3 className="text-2xl font-bold text-foreground">Servicio Completo de Selección</h3>
                <p className="text-muted-foreground mt-1.5 text-base leading-relaxed">Este servicio incluye las tres fases del proceso de selección para encontrar el candidato ideal.</p>
              </div>

              <div className="bg-background rounded-xl p-5 md:p-6 border border-border/50 shadow-sm">
                <ul className="space-y-4 mb-6">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground font-medium">Filtrado de candidatos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground font-medium">Entrevistas personales</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground font-medium">Envío de los mejores perfiles seleccionados</span>
                  </li>
                </ul>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-5 border-t border-border/50 gap-2">
                  <span className="font-semibold text-foreground text-lg">Total:</span>
                  <div className="sm:text-right">
                    <span className="text-muted-foreground text-sm line-through mr-3">148,50 € + IVA</span>
                    <span className="text-3xl font-extrabold text-primary tracking-tight">179,69 € <span className="text-sm font-semibold tracking-normal">IVA incluido</span></span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 dark:text-amber-400 leading-relaxed">
                  <strong>⚠️ Importante:</strong> El servicio completo incluye obligatoriamente las tres fases del proceso y se contrata de forma conjunta.
                </p>
              </div>

              {/* Selection Button */}
              <div className="pt-2">
                <Button 
                  variant={selectedService === 'complete' ? "default" : "outline"} 
                  className="w-full sm:w-auto font-medium transition-all duration-300 pointer-events-none"
                >
                  {selectedService === 'complete' ? (
                    <><Check className="w-4 h-4 mr-2" /> Servicio seleccionado</>
                  ) : "Seleccionar servicio completo"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Option 2: Independent Services */}
      <div className="space-y-5">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-1">Servicios Independientes</h3>
          <p className="text-muted-foreground">Contrata únicamente el servicio que necesites de forma individual.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Card 1 - Filtrado */}
          <Card 
            className={cn(
              "cursor-pointer transition-all duration-300 border-2 flex flex-col h-full relative overflow-hidden",
              selectedService === 'filtrado' ? "service-card-selected" : "border-border/50 hover:border-primary/50 bg-card"
            )}
            onClick={() => onServiceChange('filtrado')}
          >
            {selectedService === 'filtrado' && (
              <div className="service-badge">
                <Check className="w-3.5 h-3.5" /> Seleccionado
              </div>
            )}
            
            <CardContent className="p-6 flex flex-col h-full relative z-0">
              <div className="flex items-start gap-3 mb-3">
                <div className="shrink-0 mt-1">
                  {selectedService === 'filtrado' ? (
                    <CircleDot className="w-5 h-5 text-primary" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <h4 className="text-lg font-bold text-foreground pr-16">Filtrado de candidatos</h4>
              </div>
              
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed flex-grow pl-8">
                FITJOB busca, selecciona y filtra candidatos cualificados para enviar los tres mejores perfiles con experiencia y permiso de trabajo.
              </p>
              
              <div className="pl-8 mb-6">
                <span className="text-muted-foreground text-sm line-through block mb-1">30,17 € + IVA</span>
                <span className="block font-bold text-foreground text-2xl tracking-tight">36,50 € <span className="text-sm text-muted-foreground font-semibold tracking-normal">IVA inc.</span></span>
              </div>

              <div className="mt-auto pl-8 border-t border-border/50 pt-5">
                <Button 
                  variant={selectedService === 'filtrado' ? "default" : "outline"} 
                  className="w-full font-medium transition-all duration-300 pointer-events-none"
                >
                  {selectedService === 'filtrado' ? (
                    <><Check className="w-4 h-4 mr-2" /> Servicio seleccionado</>
                  ) : "Seleccionar servicio"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Card 2 - Envío */}
          <Card 
            className={cn(
              "cursor-pointer transition-all duration-300 border-2 flex flex-col h-full relative overflow-hidden",
              selectedService === 'envio' ? "service-card-selected" : "border-border/50 hover:border-primary/50 bg-card"
            )}
            onClick={() => onServiceChange('envio')}
          >
            {selectedService === 'envio' && (
              <div className="service-badge">
                <Check className="w-3.5 h-3.5" /> Seleccionado
              </div>
            )}

            <CardContent className="p-6 flex flex-col h-full relative z-0">
              <div className="flex items-start gap-3 mb-3">
                <div className="shrink-0 mt-1">
                  {selectedService === 'envio' ? (
                    <CircleDot className="w-5 h-5 text-primary" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <h4 className="text-lg font-bold text-foreground pr-16">Envío de candidatos</h4>
              </div>
              
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed flex-grow pl-8">
                FITJOB filtra, selecciona y cita a los mejores candidatos para entrevista, enviando únicamente perfiles cualificados, con experiencia y permiso de trabajo.
              </p>
              
              <div className="pl-8 mb-6">
                <span className="text-muted-foreground text-sm line-through block mb-1">48,76 € + IVA</span>
                <span className="block font-bold text-foreground text-2xl tracking-tight">59,00 € <span className="text-sm text-muted-foreground font-semibold tracking-normal">IVA inc.</span></span>
              </div>

              <div className="mt-auto pl-8 border-t border-border/50 pt-5">
                <Button 
                  variant={selectedService === 'envio' ? "default" : "outline"} 
                  className="w-full font-medium transition-all duration-300 pointer-events-none"
                >
                  {selectedService === 'envio' ? (
                    <><Check className="w-4 h-4 mr-2" /> Servicio seleccionado</>
                  ) : "Seleccionar servicio"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="info-note flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 mt-2">
          <CheckCircle2 className="w-6 h-6 text-primary shrink-0 sm:mt-0.5" />
          <span className="text-foreground font-semibold text-base sm:text-lg">
            Soluciones a medida: Selecciona los servicios que mejor se adapten a tu búsqueda de candidatos.
          </span>
        </div>
      </div>
    </div>
  );
};

export default ServiceSelectionStep;