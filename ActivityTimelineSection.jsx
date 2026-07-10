import React from 'react';
import { getActivityTimeline } from '@/lib/dashboardDataFetcher.js';

const ActivityTimelineSection = ({ data }) => {
  const timelineEvents = getActivityTimeline(data);
  if (!timelineEvents || timelineEvents.length === 0) return null;

  // Limit to recent 10 activities to keep UI clean
  const recentEvents = timelineEvents.slice(0, 10);

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-foreground tracking-tight">Actividad Reciente</h2>
      
      <div className="relative pt-2 pb-6 pl-4">
        {/* Vertical line */}
        <div className="absolute left-7 top-4 bottom-4 w-0.5 bg-border rounded-full" />
        
        <div className="space-y-8">
          {recentEvents.map((event, index) => {
            const formattedDate = new Date(event.date).toLocaleDateString('es-ES', {
              day: 'numeric', month: 'short', year: 'numeric'
            });
            const formattedTime = new Date(event.date).toLocaleTimeString('es-ES', {
              hour: '2-digit', minute: '2-digit'
            });

            return (
              <div key={`${event.id}-${index}`} className="relative pl-12 flex items-start group">
                {/* Event icon dot */}
                <div 
                  className={`absolute left-0 w-8 h-8 rounded-full border-2 border-background flex items-center justify-center shadow-sm z-10 -translate-x-1/2 ${event.color}`}
                >
                  <span className="text-sm" role="img" aria-label={event.type}>
                    {event.icon}
                  </span>
                </div>
                
                {/* Event content */}
                <div className="bg-card border border-border rounded-xl p-4 shadow-sm w-full max-w-2xl group-hover:border-primary/30 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{event.title}</h3>
                    <span className="text-xs font-medium text-muted-foreground whitespace-nowrap bg-muted px-2 py-1 rounded-md">
                      {formattedDate} • {formattedTime}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ActivityTimelineSection;