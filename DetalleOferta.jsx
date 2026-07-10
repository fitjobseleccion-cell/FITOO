import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Briefcase, Clock, Euro, CheckCircle2, ChevronLeft, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatSalary, formatDate } from '@/lib/formatters.js';
import pb from '@/lib/pocketbaseClient';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

export default function DetalleOferta() {
  const { id } = useParams();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOffer = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const record = await pb.collection('ofertas').getOne(id, { $autoCancel: false });
      setOffer(record);
    } catch (e) {
      console.error('Failed to fetch offer details:', e);
      setError(e.message || 'Error al cargar la oferta');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOffer();
  }, [fetchOffer]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-20">
        <div className="container max-w-4xl space-y-8">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-48 w-full rounded-xl" />
            </div>
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h2 className="text-2xl font-bold mb-4">{error || 'Oferta no encontrada'}</h2>
          <Link to="/ofertas-de-trabajo">
            <Button>Volver al listado</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="container max-w-5xl">
        <Link to="/ofertas-de-trabajo" className="inline-flex items-center text-sm text-slate-500 hover:text-primary mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" /> Volver a ofertas
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">{offer.puesto || offer.titulo}</h1>
              <p className="text-xl text-slate-600 mb-6">{offer.empresa || 'Empresa confidencial'}</p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-slate-400" />
                  {offer.ciudad || offer.ubicacion}, {offer.provincia || ''}
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-slate-400" />
                  {offer.tipo_contrato} • {offer.jornada}
                </div>
                {offer.salario_minimo && (
                  <div className="flex items-center gap-2">
                    <Euro className="w-5 h-5 text-slate-400" />
                    {formatSalary(offer.salario_minimo, offer.salario_maximo)}
                  </div>
                )}
              </div>
            </div>
            
            <div className="shrink-0 flex flex-col gap-3 min-w-[200px]">
              <Link to={`/ofertas-de-trabajo/${offer.id}/inscribirse`}>
                <Button size="lg" className="w-full text-lg shadow-md hover:shadow-lg transition-all">
                  Inscribirme
                </Button>
              </Link>
              <p className="text-xs text-center text-slate-500">
                Publicada {formatDate(offer.fecha_publicacion || offer.created)}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.section 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Descripción de la oferta</h2>
              <div className="text-slate-600 leading-relaxed space-y-4 whitespace-pre-wrap">
                {offer.descripcion}
              </div>

              {offer.funciones && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">¿Cuáles serán tus funciones?</h3>
                  <div className="text-slate-600 whitespace-pre-wrap">{offer.funciones}</div>
                </div>
              )}

              {offer.requisitos && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Requisitos</h3>
                  <div className="text-slate-600 whitespace-pre-wrap">{offer.requisitos}</div>
                </div>
              )}

              {offer.beneficios && (
                <div className="mt-8 bg-green-50 rounded-2xl p-6 border border-green-100">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">¿Qué ofrecemos?</h3>
                  <div className="text-slate-700 whitespace-pre-wrap">{offer.beneficios}</div>
                </div>
              )}
            </motion.section>
          </div>

          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900 text-white rounded-3xl p-6 shadow-sm"
            >
              <h3 className="font-bold text-lg mb-6 border-b border-slate-800 pb-4">Resumen de la oferta</h3>
              
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-slate-400 font-medium mb-1">Empresa</dt>
                  <dd className="font-semibold">{offer.empresa || 'Confidencial'}</dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium mb-1">Modalidad</dt>
                  <dd className="font-semibold">{offer.modalidad || 'No especificada'}</dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium mb-1">Vacantes</dt>
                  <dd className="font-semibold">{offer.vacantes || 1}</dd>
                </div>
                {offer.fecha_incorporacion && (
                  <div>
                    <dt className="text-slate-400 font-medium mb-1">Incorporación</dt>
                    <dd className="font-semibold flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" /> {formatDate(offer.fecha_incorporacion)}
                    </dd>
                  </div>
                )}
              </dl>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}