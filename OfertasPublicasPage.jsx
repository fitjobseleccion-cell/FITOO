import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, MapPin, Briefcase, Clock, Coins, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useFetchOffers } from '@/hooks/useFetchOffers.js';

export default function OfertasPublicasPage() {
  const navigate = useNavigate();
  const [puesto, setPuesto] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [contrato, setContrato] = useState('Todos');

  const filters = useMemo(() => ({
    search: puesto,
    ubicacion,
    tipo_contrato: contrato
  }), [puesto, ubicacion, contrato]);

  const { ofertas, isLoading, error, hasMore, loadMore } = useFetchOffers(filters);

  return (
    <>
      <Helmet>
        <title>Ofertas de Trabajo | FITJOB</title>
      </Helmet>

      <div className="min-h-screen bg-muted/20 pb-24">
        <section className="bg-foreground text-background py-20 px-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-50"></div>
          <div className="container relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Ofertas de trabajo</h1>
              <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
                Encuentra tu próxima oportunidad profesional
              </p>
            </motion.div>
          </div>
        </section>

        <div className="container">
          <div className="flex flex-col md:flex-row gap-4 w-full max-w-4xl mx-auto p-4 bg-card rounded-xl shadow-lg border -mt-10 relative z-10 mb-16">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Puesto o palabra clave" 
                className="pl-10 h-12 border-none shadow-none focus-visible:ring-0 bg-transparent"
                value={puesto}
                onChange={(e) => setPuesto(e.target.value)}
              />
            </div>
            <div className="w-px bg-border hidden md:block my-2"></div>
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Ubicación" 
                className="pl-10 h-12 border-none shadow-none focus-visible:ring-0 bg-transparent"
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
              />
            </div>
            <div className="w-px bg-border hidden md:block my-2"></div>
            <div className="flex-1">
              <Select value={contrato} onValueChange={setContrato}>
                <SelectTrigger className="h-12 border-none shadow-none focus:ring-0 bg-transparent">
                  <SelectValue placeholder="Tipo de contrato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Cualquier contrato</SelectItem>
                  <SelectItem value="Indefinido">Indefinido</SelectItem>
                  <SelectItem value="Temporal">Temporal</SelectItem>
                  <SelectItem value="Prácticas">Prácticas</SelectItem>
                  <SelectItem value="Autónomo">Autónomo</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
          ) : ofertas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ofertas.map((oferta, index) => (
                <motion.div 
                  key={oferta.id}
                  className="bg-card border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col h-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: (index % 12) * 0.05 }}
                  onClick={() => navigate(`/ofertas-de-trabajo/${oferta.id}`)}
                >
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {oferta.puesto || oferta.titulo}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2 shrink-0" />
                      <span className="truncate">{oferta.ciudad || oferta.ubicacion}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Briefcase className="w-4 h-4 mr-2 shrink-0" />
                      <span>{oferta.tipo_contrato || 'Contrato'} • {oferta.jornada || 'Jornada'}</span>
                    </div>
                    {oferta.salario_minimo && (
                      <div className="flex items-center text-sm font-medium text-foreground">
                        <Coins className="w-4 h-4 mr-2 text-primary shrink-0" />
                        <span>{oferta.salario_minimo} € - {oferta.salario_maximo} €</span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                    {oferta.descripcion || 'Sin descripción disponible.'}
                  </p>

                  <div className="mt-auto pt-4 border-t">
                    <span className="text-primary font-medium text-sm group-hover:underline">Ver detalles de la oferta →</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-card rounded-2xl border border-dashed">
              <Briefcase className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">Actualmente no hay ofertas disponibles</h3>
              <p className="text-muted-foreground max-w-md">
                No hemos encontrado ofertas que coincidan con tus criterios de búsqueda. Intenta ajustar los filtros.
              </p>
              <Button 
                variant="outline" 
                className="mt-6"
                onClick={() => { setPuesto(''); setUbicacion(''); setContrato('Todos'); }}
              >
                Limpiar filtros
              </Button>
            </div>
          )}

          {hasMore && !isLoading && (
            <div className="mt-12 text-center">
              <Button onClick={loadMore} size="lg" variant="outline" className="px-8">
                Cargar más ofertas
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}