import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, MapPin, Briefcase, Clock, Coins, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import pb from '@/lib/pocketbaseClient';

export default function OfertaDetallePublica() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [oferta, setOferta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOferta = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const record = await pb.collection('ofertas').getOne(id, { $autoCancel: false });
      setOferta(record);
    } catch (e) {
      console.error('Failed to fetch public offer:', e);
      setError(e.message || 'No se pudo cargar la oferta');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOferta();
  }, [fetchOferta]);

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/20 pt-24 pb-20 container max-w-4xl">
        <Skeleton className="h-10 w-32 mb-8" />
        <div className="bg-card rounded-2xl p-8 border shadow-sm">
          <Skeleton className="h-12 w-3/4 mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
          <Skeleton className="h-32 w-full mb-6" />
        </div>
      </div>
    );
  }

  if (error || !oferta) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold mb-4">{error || 'Oferta no encontrada'}</h2>
        <Button onClick={() => navigate('/ofertas-publicas')}>Volver a ofertas</Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{oferta.puesto || oferta.titulo} | FITJOB</title>
      </Helmet>

      <div className="min-h-screen bg-muted/20 pt-24 pb-24">
        <div className="container max-w-4xl">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/ofertas-publicas')}
            className="mb-6 pl-0 hover:bg-transparent hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a ofertas
          </Button>

          <div className="bg-card rounded-3xl shadow-sm border overflow-hidden">
            <div className="p-8 md:p-10 border-b">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">{oferta.puesto || oferta.titulo}</h1>
              
              <div className="flex flex-wrap gap-4 md:gap-8">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="w-5 h-5 mr-2 text-primary" />
                  <span className="font-medium">{oferta.ciudad || oferta.ubicacion}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Briefcase className="w-5 h-5 mr-2 text-primary" />
                  <span className="font-medium">{oferta.tipo_contrato || 'Contrato'}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="w-5 h-5 mr-2 text-primary" />
                  <span className="font-medium">{oferta.jornada || 'Jornada'}</span>
                </div>
                {oferta.salario_minimo && (
                  <div className="flex items-center text-foreground font-semibold">
                    <Coins className="w-5 h-5 mr-2 text-primary" />
                    <span>{oferta.salario_minimo} €</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-8 md:p-10 space-y-10">
              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground">Descripción del puesto</h2>
                <div className="prose prose-slate max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {oferta.descripcion || 'No se ha proporcionado una descripción detallada.'}
                </div>
              </section>

              {oferta.requisitos && (
                <section>
                  <h2 className="text-2xl font-bold mb-4 text-foreground">Requisitos</h2>
                  <div className="prose prose-slate max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {oferta.requisitos}
                  </div>
                </section>
              )}

              <div className="pt-8 border-t">
                <Button 
                  size="lg" 
                  className="w-full md:w-auto px-10 h-14 text-lg font-bold"
                  onClick={() => navigate(`/ofertas-publicas/${oferta.id}/inscribirse`)}
                >
                  Inscribirme ahora
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}