import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Download, MoreVertical, Star, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatEstadoAdmin, formatPuntuacion } from '@/lib/adminUtils.js';

const GestionCandidatos = () => {
  const [candidatos, setCandidatos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setCandidatos([
        { id: 1, nombre: 'Ana García', email: 'ana@ejemplo.com', puesto: 'Frontend Dev', puntuacion: 85, estado: 'preseleccionado', fecha: '2026-06-18' },
        { id: 2, nombre: 'Carlos Ruiz', email: 'carlos@ejemplo.com', puesto: 'Marketing B2B', puntuacion: 40, estado: 'descartado', fecha: '2026-06-15' },
        { id: 3, nombre: 'Elena M.', email: 'elena@ejemplo.com', puesto: 'Backend Dev', puntuacion: 95, estado: 'en_revision', fecha: '2026-06-19' },
      ]);
      setLoading(false);
    }, 400);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Candidatos</h1>
          <p className="text-slate-500">Revisa, filtra y evalúa a los candidatos recibidos.</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" /> Exportar CSV
        </Button>
      </div>

      {/* Advanced Filters (Simplified View) */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por nombre, email o DNI..." 
            className="w-full pl-9 h-10 border border-slate-200 rounded-lg text-sm"
          />
        </div>
        <select className="h-10 border border-slate-200 rounded-lg text-sm px-3 bg-white">
          <option value="">Todas las ofertas</option>
          <option>Frontend Dev</option>
        </select>
        <select className="h-10 border border-slate-200 rounded-lg text-sm px-3 bg-white">
          <option value="">Cualquier estado</option>
          <option>Preseleccionado</option>
          <option>En revisión</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Candidato</th>
                <th className="px-6 py-4 font-semibold">Oferta</th>
                <th className="px-6 py-4 font-semibold">Match Score</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold">Inscripción</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {candidatos.map(c => {
                const est = formatEstadoAdmin(c.estado);
                const score = formatPuntuacion(c.puntuacion);
                return (
                  <tr key={c.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{c.nombre}</p>
                      <p className="text-xs text-slate-500">{c.email}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{c.puesto}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <span className="font-bold text-slate-900 mr-1">{score.text}</span>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < score.stars ? 'fill-current' : 'text-slate-200'}`} />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${est.color}`}>
                        {est.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 flex items-center gap-1.5 mt-1">
                      <Calendar className="w-4 h-4" /> {c.fecha}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="h-8 text-primary">
                        <Eye className="w-4 h-4 mr-1.5" /> Ver Detalle
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GestionCandidatos;