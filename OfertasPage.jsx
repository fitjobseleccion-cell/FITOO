import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ShieldCheck, Building2, MapPin, Briefcase, Coins, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OfferSearchBar from '@/components/OfferSearchBar.jsx';
import { useFetchOffers } from '@/hooks/useFetchOffers.js';
import pb from '@/lib/pocketbaseClient';

export default function OfertasPage() {
  const navigate = useNavigate();
  const [activeFilters, setActiveFilters] = useState({});
  const { ofertas, isLoading, error, hasMore, loadMore } = useFetchOffers(activeFilters);

  const handleSearch = (filters) => {
    setActiveFilters(filters);
  };

  const handleInscribirse = (ofertaId) => {
    if (!pb.authStore.isValid) {
      navigate('/login');
    } else {
      navigate(`/ofertas-de-trabajo/${ofertaId}/inscribirse`);
    }
  };

  return (
    <>
      <Helmet>
        <title>Ofertas de Trabajo Verificadas | FITJOB</title>
        <meta name="description" content="Encuentra oportunidades profesionales verificadas por el equipo de FITJOB." />
      </Helmet>
      
      <div className="min-h-[100dvh] bg-background pb-24 flex flex-col">
        <section className="relative pt-24 pb-24 lg:pb-32 overflow-hidden bg-muted/30">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--primary)/0.1),_transparent_50%)] pointer-events-none" />
          
          <div className="container relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
                className="max-w-2xl"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
                  <ShieldCheck className="w-4 h-4" />
                  Ofertas revisadas por el equipo de FITJOB
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6 text-foreground">
                  Encuentra oportunidades profesionales <span className="text-primary">verificadas</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-prose">
                  Nuestro equipo de selección verifica manualmente cada oferta y empresa para garantizar condiciones transparentes, salarios justos y el mejor encaje para tu carrera.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 0.6, delay: 0.1 }}
                className="hidden lg:flex justify-center items-center"
              >
                <svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-md drop-shadow-xl">
                  <rect x="50" y="40" width="300" height="220" rx="24" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2"/>
                  <rect x="80" y="80" width="140" height="16" rx="8" fill="hsl(var(--muted))" />
                  <rect x="80" y="110" width="240" height="12" rx="6" fill="hsl(var(--muted))" opacity="0.6"/>
                  <rect x="80" y="130" width="200" height="12" rx="6" fill="hsl(var(--muted))" opacity="0.6"/>
                  
                  <circle cx="300" cy="180" r="40" fill="hsl(var(--primary)/0.1)" />
                  <circle cx="300" cy="180" r="20" fill="hsl(var(--primary))" />
                  <path d="M294 180L298 184L306 176" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  
                  <rect x="80" y="180" width="60" height="60" rx="16" fill="hsl(var(--primary)/0.05)" stroke="hsl(var(--primary)/0.2)" strokeWidth="2"/>
                  <path d="M100 205C100 199.477 104.477 195 110 195C115.523 195 120 199.477 120 205V220H100V205Z" fill="hsl(var(--primary))"/>
                  <circle cx="110" cy="200" r="8" fill="hsl(var(--primary))"/>
                </svg>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="container relative z-20 -mt-10 mb-12 lg:-mt-16 lg:mb-16">
          <OfferSearchBar onSearch={handleSearch} />
        </div>

        <div className="container flex-1">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold">
              {Object.keys(activeFilters).length > 0 ? 'Resultados de tu búsqueda' : 'Últimas oportunidades'}
            </h2>
          </div>

          <div className="bg-card rounded-3xl border border-border/50 shadow-sm p-6 md:p-8 min-h-[400px]">
            <div className="relative">
              {error && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-xl mb-6 text-sm font-medium">
                  {error}
                </div>
              )}

              {isLoading && ofertas.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
                  <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                  <p>Buscando las mejores ofertas para ti...</p>
                </div>
              ) : ofertas.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {ofertas.map((oferta, index) => (
                    <motion.div 
                      key={oferta.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: (index % 10) * 0.05 }}
                      className="group bg-background border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
                    >
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2">
                          {oferta.titulo || oferta.puesto}
                        </h3>
                        <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                          <Building2 className="w-4 h-4" />
                          {oferta.empresa || 'Empresa confidencial'}
                        </p>
                      </div>

                      <div className="space-y-2.5 mb-6">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 mr-2.5 shrink-0" />
                          <span className="truncate">{oferta.ubicacion || oferta.ciudad}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-2.5 shrink-0" />
                          {oferta.tipo_contrato || 'Contrato'} • {oferta.jornada || 'Jornada'}
                        </div>
                        {(oferta.salario_minimo || oferta.salario_maximo) && (
                          <div className="flex items-center text-sm font-medium text-foreground">
                            <Coins className="w-4 h-4 mr-2.5 shrink-0 text-primary" />
                            {oferta.salario_minimo ? `${oferta.salario_minimo} €` : ''} 
                            {oferta.salario_minimo && oferta.salario_maximo ? ' - ' : ''}
                            {oferta.salario_maximo ? `${oferta.salario_maximo} €` : ''} / año
                          </div>
                        )}
                      </div>

                      <div className="mt-auto pt-5 border-t flex items-center gap-3">
                        <Button 
                          variant="outline" 
                          className="flex-1 bg-muted/30 hover:bg-muted"
                          onClick={() => navigate(`/ofertas-de-trabajo/${oferta.id}`)}
                        >
                          Detalles
                        </Button>
                        <Button 
                          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                          onClick={() => handleInscribirse(oferta.id)}
                        >
                          Inscribirme
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-24 px-4 bg-muted/20 rounded-2xl border border-dashed border-border">
                  <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-6">
                    <Briefcase className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">No hay resultados</h3>
                  <p className="text-muted-foreground max-w-md mb-6">
                    No hemos encontrado ofertas que coincidan exactamente con tus criterios de búsqueda. Intenta ajustar los filtros.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveFilters({})}
                  >
                    Ver todas las ofertas
                  </Button>
                </div>
              )}

              {hasMore && !isLoading && (
                <div className="mt-12 text-center">
                  <Button onClick={loadMore} size="lg" variant="secondary" className="px-8 font-medium">
                    Cargar más resultados
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}