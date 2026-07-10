import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Briefcase, Clock, Users, Coins, CheckCircle2, Building2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import InscripcionModal from '@/components/InscripcionModal.jsx';

export default function OfertaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [oferta, setOferta] = useState(null);
  const [candidatosCount, setCandidatosCount] = useState(0);
  const [companyReviews, setCompanyReviews] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOfertaData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch oferta con su admin_id expandido para info de la empresa
      const record = await pb.collection('ofertas').getOne(id, { 
        expand: 'admin_id',
        $autoCancel: false 
      });
      setOferta(record);

      // 2. Fetch número de inscritos
      const candidatosList = await pb.collection('candidatos').getList(1, 1, { 
        filter: `oferta_id="${id}"`,
        $autoCancel: false 
      });
      setCandidatosCount(candidatosList.totalItems);

      // 3. Comprobar si ya está inscrito
      if (user) {
        const myEnrollment = await pb.collection('candidatos').getList(1, 1, {
          filter: `oferta_id="${id}" && usuario_id="${user.id}"`,
          $autoCancel: false
        });
        setIsEnrolled(myEnrollment.totalItems > 0);
      }

      // 4. Fetch reseñas de la empresa si hay un admin_id
      if (record.admin_id) {
        try {
          const reviews = await pb.collection('reviews').getList(1, 3, {
            filter: `userId="${record.admin_id}" && status='approved'`,
            sort: '-created',
            $autoCancel: false
          });
          setCompanyReviews(reviews.items);
        } catch (e) {
          console.log('No reviews found or error fetching reviews', e);
        }
      }

    } catch (e) {
      console.error('Failed to fetch offer data:', e);
      setError('No se pudo cargar la oferta o no existe.');
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    fetchOfertaData();
  }, [fetchOfertaData]);

  const handleEnrollClick = () => {
    if (!user) {
      navigate('/login', { state: { from: `/ofertas-de-trabajo/${id}` } });
      return;
    }
    setIsModalOpen(true);
  };

  const handleSuccessEnrollment = () => {
    setIsEnrolled(true);
    setCandidatosCount(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/20 pt-24 pb-20 container max-w-6xl">
        <Skeleton className="h-10 w-32 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-[400px] w-full rounded-2xl" />
            <Skeleton className="h-[200px] w-full rounded-2xl" />
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-[300px] w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !oferta) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">{error}</h2>
        <Button onClick={() => navigate('/ofertas-de-trabajo')}>Volver a ofertas</Button>
      </div>
    );
  }

  const empresaData = oferta.expand?.admin_id;

  return (
    <>
      <Helmet>
        <title>{oferta.puesto || oferta.titulo} en {oferta.empresa} | FITJOB</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50/50 dark:bg-background pt-24 pb-20">
        <div className="container max-w-6xl">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/ofertas-de-trabajo')}
            className="mb-8 hover:bg-transparent hover:text-primary pl-0 text-muted-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a ofertas
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* MAIN CONTENT */}
            <motion.div 
              className="lg:col-span-2 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-card rounded-2xl shadow-sm border overflow-hidden">
                <div className="p-8 md:p-10 border-b">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                      {oferta.sector || 'Sector general'}
                    </Badge>
                    {oferta.modalidad && (
                      <Badge variant="outline">{oferta.modalidad}</Badge>
                    )}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-balance">
                    {oferta.puesto || oferta.titulo}
                  </h1>
                  
                  {candidatosCount > 0 && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300 rounded-full text-sm font-medium mb-6">
                      <Users className="w-4 h-4" />
                      👥 {candidatosCount} personas ya se han inscrito
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{oferta.ciudad || oferta.ubicacion}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Briefcase className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm capitalize">{oferta.tipo_contrato || 'Contrato'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm capitalize">{oferta.jornada || 'Jornada'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{oferta.vacantes || 1} vacantes</span>
                    </div>
                  </div>
                </div>

                <div className="p-8 md:p-10 space-y-10">
                  {oferta.salario_minimo && (
                    <div className="flex items-center gap-3 bg-green-50 dark:bg-green-950/20 text-green-800 dark:text-green-300 p-4 rounded-xl border border-green-100 dark:border-green-900/50">
                      <Coins className="w-6 h-6" />
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide opacity-80 mb-0.5">Salario estimado</p>
                        <p className="font-semibold text-lg">
                          {oferta.salario_minimo} € - {oferta.salario_maximo} € <span className="text-sm font-normal">brutos/año</span>
                        </p>
                      </div>
                    </div>
                  )}

                  <section>
                    <h2 className="text-xl md:text-2xl font-bold mb-4 text-foreground">Descripción del puesto</h2>
                    <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {oferta.descripcion || 'No se ha proporcionado una descripción detallada.'}
                    </div>
                  </section>

                  {oferta.requisitos && (
                    <section>
                      <h2 className="text-xl md:text-2xl font-bold mb-4 text-foreground">Requisitos</h2>
                      <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {oferta.requisitos}
                      </div>
                    </section>
                  )}
                  
                  {oferta.beneficios && (
                    <section>
                      <h2 className="text-xl md:text-2xl font-bold mb-4 text-foreground">Beneficios</h2>
                      <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {oferta.beneficios}
                      </div>
                    </section>
                  )}

                </div>
              </div>
            </motion.div>

            {/* SIDEBAR */}
            <motion.div 
              className="lg:col-span-1 space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* Enrollment Card */}
              <div className="bg-card rounded-2xl shadow-sm border p-6 sticky top-24">
                <Button 
                  size="lg" 
                  className="w-full text-base font-semibold h-12"
                  disabled={isEnrolled}
                  onClick={handleEnrollClick}
                >
                  {isEnrolled ? (
                    <><CheckCircle2 className="w-5 h-5 mr-2" /> Ya inscrito</>
                  ) : (
                    'Inscribirme ahora'
                  )}
                </Button>
                <p className="text-center text-xs text-muted-foreground mt-4">
                  Inscribirse no tiene coste alguno.
                </p>
              </div>

              {/* Company Profile Card */}
              <div className="bg-card rounded-2xl shadow-sm border p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Sobre la empresa</h3>
                
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 text-muted-foreground">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-lg leading-tight flex items-center gap-1.5">
                      {oferta.empresa}
                      {empresaData?.verificado && (
                        <span title="Empresa Verificada">🟢</span>
                      )}
                    </h4>
                    {oferta.sector && (
                      <p className="text-sm text-muted-foreground mt-0.5">{oferta.sector}</p>
                    )}
                  </div>
                </div>

                {companyReviews.length > 0 ? (
                  <div className="space-y-4 pt-4 border-t">
                    <h5 className="font-semibold text-sm text-foreground">Reseñas recientes</h5>
                    {companyReviews.map(review => (
                      <div key={review.id} className="bg-muted/40 p-3 rounded-xl border text-sm">
                        <div className="flex items-center gap-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted'}`} 
                            />
                          ))}
                        </div>
                        <p className="text-foreground font-medium text-xs mb-1 line-clamp-1">{review.title}</p>
                        <p className="text-muted-foreground text-xs line-clamp-2">{review.comment}</p>
                      </div>
                    ))}
                    <Button variant="link" className="w-full text-xs text-primary p-0 h-auto">
                      + Ver más valoraciones
                    </Button>
                  </div>
                ) : (
                  <div className="pt-4 border-t text-sm text-muted-foreground text-center">
                    Esta empresa aún no tiene reseñas.
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <InscripcionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        oferta={oferta}
        onSuccess={handleSuccessEnrollment}
      />
    </>
  );
}