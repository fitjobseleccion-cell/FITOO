import React from 'react';
import { GraduationCap, Clock } from 'lucide-react';

const CoursesSection = ({ courses }) => {
  if (!courses || courses.length === 0) return null;

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-foreground tracking-tight">Formación y Cursos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => {
          const progress = course.progreso || 0;
          const courseName = course.expand?.curso_id?.nombre || course.nombre || 'Curso de especialización';
          const startDate = new Date(course.created).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });

          return (
            <div key={course.id} className="p-6 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 rounded-xl">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground line-clamp-2">{courseName}</h3>
                  <div className="flex items-center text-xs text-muted-foreground mt-2">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    Iniciado en {startDate}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-muted-foreground">Progreso</span>
                  <span className="text-foreground">{progress}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-600 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CoursesSection;