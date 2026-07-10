import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFetchOffers } from '@/hooks/useFetchOffers.js';
import BuscadorOfertas from '@/components/ofertas/BuscadorOfertas.jsx';
import TarjetaOferta from '@/components/ofertas/TarjetaOferta.jsx';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

export default function ListadoOfertas() {
  const navigate = useNavigate();
  const [filtersState, setFiltersState] = useState({});

  const handleSearch = useCallback((newFilters) => {
    setFiltersState(newFilters);
  }, []);

  const memoizedFilters = useMemo(() => filtersState, [filtersState]);

  const { ofertas, isLoading, error, hasMore, loadMore } = useFetchOffers(memoizedFilters);

  const handleInscribirse = (ofertaId) => {
    if (!pb.authStore.isValid) {
      navigate('/login');
    } else {
      navigate(`/inscripcion-oferta/${ofertaId}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="bg-slate-900 text-white pt-16 pb-24 px-4 sm:px-6">
        <div className="container text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-balance">
            Encuentra tu próximo desafío profesional
          </h1>
          <p className="text-lg text-slate-300">
            Descubre cientos de ofertas validadas y prepárate para dar el siguiente paso en tu carrera.
          </p>
        </div>
      </div>

      <BuscadorOfertas onSearch={handleSearch} />

      <div className="container mt-12">
        <div className="mb-6 flex justify-between items-end">
          <h2 className="text-2xl font-bold text-slate-900">
            {isLoading && ofertas.length === 0 ? 'Buscando...' : `${ofertas.length} ofertas mostradas`}
          </h2>
        </div>

        {error && (
          <div className="text-center py-10 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 mb-8 font-medium">
            <p>{error}</p>
          </div>
        )}

        {isLoading && ofertas.length === 0 ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {ofertas.map((offer, index) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index % 12) * 0.05 }}
                  className="flex flex-col"
                >
                  <div className="h-full flex flex-col">
                    <TarjetaOferta offer={offer} />
                    <div className="mt-2 w-full">
                       <Button 
                          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                          onClick={() => handleInscribirse(offer.id)}
                        >
                          Inscribirme
                        </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {!isLoading && !error && ofertas.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-lg text-slate-500 font-medium">Actualmente no hay ofertas disponibles con estos filtros.</p>
                <Button variant="link" onClick={() => handleSearch({})} className="mt-2 text-primary">
                  Limpiar filtros
                </Button>
              </div>
            )}

            {hasMore && ofertas.length > 0 && (
              <div className="mt-12 text-center">
                <Button 
                  onClick={loadMore} 
                  disabled={isLoading}
                  size="lg"
                  variant="outline"
                  className="px-8 bg-white"
                >
                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Cargar más ofertas
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}