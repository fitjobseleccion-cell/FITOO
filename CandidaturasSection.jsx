import React from 'react';
import { Building2, Calendar, AlertCircle } from 'lucide-react';
import { getStatusColor, getStatusLabel } from '@/lib/dashboardDataFetcher.js';

const CandidaturasSection = ({ candidaturas }) => {
  if (!candidaturas || candidaturas.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground tracking-tight">Mis Candidaturas</h2>
        <span className="bg-muted text-muted-foreground text-xs font-medium px-2.5 py-1 rounded-full">
          {candidaturas.length}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidaturas.map((candidatura) => {
          // Allow reading from either estado or estado_candidatura depending on the fetch strategy
          const currentStatus = candidatura.estado_candidatura || candidatura.estado;
          const { bg, text, border, icon } = getStatusColor(currentStatus);
          
          const jobTitle = candidatura.expand?.oferta_id?.puesto || candidatura.expand?.oferta_id?.titulo || 'Oferta de empleo';
          const companyName = candidatura.expand?.oferta_id?.empresa || 'Empresa confidencial';
          const date = new Date(candidatura.created).toLocaleDateString('es-ES', { 
            day: 'numeric', month: 'short' 
          });

          const isDescartado = currentStatus?.toLowerCase() === 'descartado';
          const motivoDescarte = candidatura.motivo_descarte;

          return (
            <div 
              key={candidatura.id} 
              className={`flex flex-col h-full bg-card rounded-2xl border ${border} shadow-sm hover:shadow-md transition-all duration-200 p-5`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${bg} ${text} ${border}`}>
                  <span>{icon}</span>
                  <span>{getStatusLabel(currentStatus)}</span>
                </div>
              </div>
              
              <h3 className="font-semibold text-foreground text-lg mb-2 line-clamp-2">
                {jobTitle}
              </h3>
              
              <div className="flex flex-col gap-2 mt-auto pt-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Building2 className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{companyName}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>Enviado: {date}</span>
                </div>
              </div>

              {isDescartado && motivoDescarte && (
                <div className="mt-5 p-3.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl flex gap-3 items-start">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">Motivo: {motivoDescarte}</p>
                    <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-1 leading-relaxed">
                      ¡Sigue intentándolo! Cada experiencia te acerca más a tu objetivo.
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CandidaturasSection;