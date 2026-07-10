import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { motion } from 'framer-motion';
import { Clock, MapPin, Building, ChevronRight, LogOut, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/formatters.js';

const STATUS_CONFIG = {
  recibido: { label: 'Recibido', color: 'bg-[#eab308] text-white', icon: Clock },
  en_revision: { label: 'En revisión', color: 'bg-[#3b82f6] text-white', icon: Clock },
  preseleccionado: { label: 'Preseleccionado', color: 'bg-[#16a34a] text-white', icon: CheckCircle },
  entrevista_presencial: { label: 'Entrevista', color: 'bg-[#a855f7] text-white', icon: Building },
  descartado: { label: 'Descartado', color: 'bg-[#ef4444] text-white', icon: XCircle }
};

const PanelCandidato = () => {
  const { user, logout } = useAuth();
  const [candidaturas, setCandidaturas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setCandidaturas([
        {
          id: 101,
          oferta: { puesto: 'Desarrollador Frontend Senior', empresa: 'TechCorp Solutions', ciudad: 'Madrid' },
          estado: 'preseleccionado',
          fecha_inscripcion: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
        {
          id: 102,
          oferta: { puesto: 'Especialista en Marketing', empresa: 'Growth & Co', ciudad: 'Barcelona' },
          estado: 'recibido',
          fecha_inscripcion: new Date(Date.now() - 86400000 * 5).toISOString(),
        },
        {
          id: 103,
          oferta: { puesto: 'Técnico de Sistemas', empresa: 'IT Services SL', ciudad: 'Valencia' },
          estado: 'descartado',
          fecha_inscripcion: new Date(Date.now() - 86400000 * 15).toISOString(),
        }
      ]);
      setLoading(false);
    }, 600);
  }, [user]);

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Cargando tu panel...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="container max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Mis Candidaturas</h1>
            <p className="text-slate-600 mt-1">Hola {user?.name}, aquí puedes seguir el estado de tus procesos.</p>
          </div>
          <Button variant="outline" onClick={logout} className="shrink-0 w-full md:w-auto">
            <LogOut className="w-4 h-4 mr-2" /> Cerrar sesión
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {candidaturas.map((cand, index) => {
            const StatusIcon = STATUS_CONFIG[cand.estado]?.icon || Clock;
            const statusColor = STATUS_CONFIG[cand.estado]?.color || 'bg-slate-200 text-slate-800';

            return (
              <motion.div 
                key={cand.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-slate-100 p-5 sm:p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-6"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${statusColor}`}>
                      <StatusIcon className="w-3 h-3 mr-1.5" />
                      {STATUS_CONFIG[cand.estado]?.label || cand.estado}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Inscrito {formatDate(cand.fecha_inscripcion)}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{cand.oferta.puesto}</h3>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-600">
                    <span className="flex items-center gap-1.5"><Building className="w-4 h-4 text-slate-400" /> {cand.oferta.empresa}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> {cand.oferta.ciudad}</span>
                  </div>
                </div>

                <div className="shrink-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto">
                  <Button variant="secondary" className="w-full sm:w-auto font-medium">
                    Ver detalles <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            );
          })}

          {candidaturas.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
              <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Aún no te has inscrito en ninguna oferta</h3>
              <p className="text-slate-500 mb-6">Explora las vacantes disponibles y encuentra tu próximo empleo.</p>
              <Button asChild>
                <a href="/ofertas">Ver ofertas de empleo</a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PanelCandidato;