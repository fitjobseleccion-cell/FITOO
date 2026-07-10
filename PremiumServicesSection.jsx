import React from 'react';
import { CheckCircle2, Calendar } from 'lucide-react';

const PremiumServicesSection = ({ services }) => {
  if (!services || services.length === 0) return null;

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-foreground tracking-tight">Servicios Premium</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => {
          const dateStr = new Date(service.created).toLocaleDateString('es-ES');
          
          return (
            <div 
              key={service.id} 
              className="relative p-6 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-background overflow-hidden"
            >
              <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 text-xs font-medium px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Activo
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center text-2xl shadow-sm border border-emerald-200 dark:border-emerald-800">
                  {service.nombre?.includes('cv') ? '📝' : service.nombre?.includes('revision') ? '👨‍💼' : '🚀'}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-emerald-950 dark:text-emerald-50">
                    {service.nombre || 'Servicio Premium'}
                  </h3>
                  <p className="text-emerald-700/80 dark:text-emerald-300/80 text-sm font-medium">
                    {service.amount ? `${service.amount} €` : 'Comprado'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-emerald-800/70 dark:text-emerald-300/70 mt-4 pt-4 border-t border-emerald-100 dark:border-emerald-900/50">
                <Calendar className="w-4 h-4" />
                <span>Adquirido el {dateStr}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PremiumServicesSection;