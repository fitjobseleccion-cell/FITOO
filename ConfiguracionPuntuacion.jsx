import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';

const ConfiguracionPuntuacion = () => {
  const { ofertaId } = useParams();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link to={`/admin/preguntas/${ofertaId || ''}`} className="inline-flex items-center text-sm text-slate-500 hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Volver a preguntas
      </Link>
      
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Configuración de Puntuación</h1>
        <p className="text-slate-500">Define los criterios para calcular el Match Score automático.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center text-slate-500">
        <Star className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <p>Añade criterios de evaluación para rankear a los candidatos automáticamente.</p>
      </div>
    </div>
  );
};

export default ConfiguracionPuntuacion;