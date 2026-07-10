import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Building2, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RecommendationsSection = ({ recommendations }) => {
  const navigate = useNavigate();
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2">
        <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
        <h2 className="text-2xl font-semibold text-foreground tracking-tight">Recomendado para ti</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((rec) => {
          const offer = rec.expand?.oferta_id;
          if (!offer) return null;

          const jobTitle = offer.puesto || offer.titulo;
          const company = offer.empresa;
          const score = rec.score || rec.compatibilidad || 0;

          return (
            <div 
              key={rec.id} 
              className="flex flex-col p-6 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-blue-200 dark:border-blue-800">
                  <Target className="w-3.5 h-3.5" />
                  {score}% Compatible
                </div>
              </div>
              
              <h3 className="font-semibold text-lg text-blue-950 dark:text-blue-50 line-clamp-2 mb-2">
                {jobTitle}
              </h3>
              
              <div className="flex items-center text-sm text-blue-800/80 dark:text-blue-200/80 mb-6">
                <Building2 className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">{company}</span>
              </div>
              
              <div className="mt-auto pt-4 border-t border-blue-100 dark:border-blue-900/50">
                <Button 
                  onClick={() => navigate(`/ofertas-de-trabajo/${offer.id}`)}
                  variant="outline" 
                  className="w-full border-blue-300 text-blue-700 hover:bg-blue-100 hover:text-blue-800 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900/50 dark:hover:text-blue-100"
                >
                  Ver oferta
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RecommendationsSection;