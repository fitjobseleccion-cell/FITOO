import React from 'react';
import { CalendarClock, Building, Mic } from 'lucide-react';

const InterviewsSection = ({ interviews }) => {
  if (!interviews || interviews.length === 0) return null;

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-foreground tracking-tight">Próximas Entrevistas</h2>
      
      <div className="flex flex-col space-y-4">
        {interviews.map((interview) => {
          const dateObj = new Date(interview.fecha_entrevista || interview.created);
          const formattedDate = dateObj.toLocaleDateString('es-ES', { 
            day: '2-digit', month: 'long', year: 'numeric' 
          });
          const formattedTime = dateObj.toLocaleTimeString('es-ES', {
            hour: '2-digit', minute: '2-digit'
          });
          
          const jobTitle = interview.expand?.oferta_id?.puesto || interview.expand?.oferta_id?.titulo || 'Entrevista programada';
          const company = interview.expand?.oferta_id?.empresa || 'Empresa confidencial';

          return (
            <div 
              key={interview.id} 
              className="flex flex-col sm:flex-row gap-4 p-5 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/50 rounded-2xl"
            >
              <div className="hidden sm:flex items-center justify-center w-12 h-12 bg-purple-200 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300 rounded-full flex-shrink-0">
                <Mic className="w-5 h-5" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-purple-950 dark:text-purple-100">{jobTitle}</h3>
                <div className="flex items-center text-sm text-purple-800/80 dark:text-purple-300/80 mt-1">
                  <Building className="w-4 h-4 mr-1.5" />
                  {company}
                </div>
              </div>
              
              <div className="flex flex-col sm:items-end justify-center pt-3 sm:pt-0 border-t border-purple-200/60 sm:border-0 sm:pl-4">
                <div className="flex items-center text-purple-900 font-medium dark:text-purple-200">
                  <CalendarClock className="w-4 h-4 mr-2" />
                  {formattedDate} a las {formattedTime}
                </div>
                {interview.enlace && (
                  <a 
                    href={interview.enlace} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-2 text-sm text-purple-600 hover:text-purple-800 hover:underline dark:text-purple-400 dark:hover:text-purple-300 font-medium"
                  >
                    Unirse a la llamada
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default InterviewsSection;