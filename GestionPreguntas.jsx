import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GestionPreguntas = () => {
  const { ofertaId } = useParams();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link to="/admin/ofertas" className="inline-flex items-center text-sm text-slate-500 hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Volver a ofertas
      </Link>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Preguntas de Cribado</h1>
          <p className="text-slate-500">Configura las preguntas para filtrar candidatos (Oferta #{ofertaId}).</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to={`/admin/puntuacion/${ofertaId}`}>
              <Settings className="w-4 h-4 mr-2" /> Puntuación
            </Link>
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" /> Nueva Pregunta
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center text-slate-500">
        <p>No hay preguntas configuradas para esta oferta todavía.</p>
        <Button variant="link" className="mt-2 text-primary">Añadir la primera pregunta</Button>
      </div>
    </div>
  );
};

export default GestionPreguntas;