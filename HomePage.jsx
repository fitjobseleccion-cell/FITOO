import React, { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Check, Star, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import ReviewCard from '@/components/ReviewCard.jsx';
import FormularioContratacion from '@/components/formularios/FormularioContratacion.jsx';

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();
  const [topReviews, setTopReviews] = useState([]);
  const [stats, setStats] = useState({ average: 0, total: 0, distribution: {} });
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchReviewsData = useCallback(async () => {
    try {
      setLoadingReviews(true);
      const allApproved = await pb.collection('reviews').getFullList({
        filter: 'status="approved"',
        $autoCancel: false
      });
      
      const total = allApproved?.length || 0;
      if (total > 0) {
        const distribution = { 1:0, 2:0, 3:0, 4:0, 5:0 };
        let sum = 0;
        allApproved.forEach(r => {
          distribution[r.rating] = (distribution[r.rating] || 0) + 1;
          sum += r.rating;
        });
        setStats({
          average: (sum / total).toFixed(1),
          total,
          distribution
        });
      }

      const top = await pb.collection('reviews').getList(1, 3, {
        filter: 'status="approved" && rating >= 4',
        sort: '-created',
        expand: 'userId,serviceId,review_responses(reviewId)',
        $autoCancel: false
      });
      setTopReviews(top?.items || []);
    } catch (error) {
      console.error("Error fetching reviews for homepage:", error);
    } finally {
      setLoadingReviews(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      fetchReviewsData();
    }
    return () => { isMounted = false; };
  }, [fetchReviewsData]);

  const handleStartSelection = useCallback(() => {
    if (isAuthenticated && currentUser?.tipo_cuenta === 'empresa') {
      navigate('/crear-oferta');
    } else {
      navigate('/signup?returnTo=/crear-oferta');
    }
  }, [isAuthenticated, currentUser, navigate]);

  return (
    <>
      <Helmet>
        <title>FITJOB | Especialistas en Selección de Personal</title>
        <meta name="description" content="En FITJOB somos una empresa especializada en la selección de personal. Encontramos los mejores candidatos para tu empresa." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex items-center justify-center pt-20" id="inicio">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1681909623271-b5d90dd4c163" alt="Oficina profesional moderna para selección de personal" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-100" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6 drop-shadow-lg">
              Nosotros buscamos.<br />
              <span className="text-primary">Tú decides.</span>
            </h1>
            
            <p className="text-lg md:text-2xl text-slate-100 mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              Encontramos los mejores candidatos para tu empresa
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                onClick={handleStartSelection}
                size="lg" 
                className="h-14 px-8 text-lg w-full sm:w-auto font-semibold rounded-full shadow-lg hover:shadow-primary/25 transition-all active:scale-[0.98]"
              >
                Empezar proceso de selección
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Link to="/ofertas-de-trabajo" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto font-semibold rounded-full border-white text-white hover:bg-white/10 bg-transparent transition-all active:scale-[0.98]">
                  Buscar empleo
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quiénes Somos Section */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              ¿Quiénes somos?
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              En FITJOB somos una empresa especializada en la selección de personal para empresas de diferentes sectores. Nos encargamos de buscar, filtrar y entrevistar candidatos para presentar únicamente aquellos perfiles que mejor se adapten a las necesidades de cada cliente. Nuestro objetivo es ahorrar tiempo a las empresas durante el proceso de contratación, ofreciendo candidatos cualificados, con experiencia y permiso de trabajo.
            </p>
          </div>
        </div>
      </section>

      {/* Servicios Section */}
      <section className="py-24 bg-muted/30" id="servicios">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Elige el servicio que necesitas</h2>
            <p className="text-lg text-muted-foreground">Contrata solo lo que necesitas</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="bg-card border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full rounded-2xl overflow-hidden relative ring-1 ring-primary/10">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-primary"></div>
              <CardContent className="p-8 sm:p-10 flex flex-col h-full">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <Users className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Servicio Completo de Selección</h3>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                  Encontramos los mejores perfiles para tu empresa, cualificados y con permiso de trabajo verificado, listos para entrevistar. Nos encargamos de todo el proceso de selección para que ahorres tiempo y solo tengas que entrevistar a los candidatos que realmente encajan con tu oferta. Además, publicamos tu oferta de empleo en nuestras redes sociales para maximizar su visibilidad.
                </p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground font-medium">Filtrado de CV</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground font-medium">Entrevistas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground font-medium">Envío de los mejores perfiles</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground font-medium">Permiso de trabajo verificado</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground font-medium">Publicación de la oferta en nuestras redes sociales</span>
                  </li>
                </ul>

                <div className="mt-auto pt-6 border-t border-border">
                  <Button 
                    onClick={handleStartSelection}
                    size="lg" 
                    className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-transform active:scale-[0.98] rounded-xl"
                  >
                    Empezar proceso de selección
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Cómo Funciona Section */}
      <section className="py-24 bg-background" id="como-funciona">
        <div className="container max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Cómo Funciona</h2>
            <p className="text-lg text-muted-foreground">Un proceso ágil diseñado para no hacerte perder el tiempo.</p>
          </div>

          <div className="space-y-12">
            {[{
              num: '1',
              title: 'Completa el formulario',
              desc: 'Cuéntanos qué perfil necesitas y las características del puesto.'
            }, {
              num: '2',
              title: 'Activa el servicio',
              desc: 'Revisa el resumen del servicio y realiza el pago de forma segura mediante Stripe.'
            }, {
              num: '3',
              title: 'Comenzamos la búsqueda',
              desc: 'Publicamos la oferta en nuestra base de datos y en las redes sociales, filtramos currículums y realizamos entrevistas.'
            }, {
              num: '4',
              title: 'Recibe los mejores candidatos',
              desc: 'Te enviamos únicamente perfiles cualificados, con permiso de trabajo verificado y listos para entrevistar.'
            }].map((step, idx) => (
              <div key={idx} className="flex items-start gap-6 md:gap-8">
                <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-bold text-primary">
                  {step.num}
                </div>
                <div className="pt-2 md:pt-4">
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-lg text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reseñas de Clientes Section */}
      <section className="py-24 bg-background">
        <div className="container max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Reseñas de Clientes</h2>
              <p className="text-lg text-muted-foreground">Descubre lo que dicen las empresas que ya han confiado en nosotros para encontrar a su candidato ideal.</p>
            </div>
            <div className="flex gap-4">
              <Link to="/reviews/new">
                <Button variant="outline" className="rounded-full">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Escribir una reseña
                </Button>
              </Link>
              <Link to="/reviews">
                <Button className="rounded-full">
                  Ver todas las reseñas
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Stats Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card p-8 rounded-3xl border border-border shadow-sm h-full flex flex-col justify-center">
                <div className="text-center mb-8">
                  <div className="text-7xl font-extrabold text-foreground mb-2 tracking-tighter">{stats.average || "0.0"}</div>
                  <div className="flex justify-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-6 h-6 ${star <= Math.round(stats.average) ? 'fill-[hsl(var(--review-star))] text-[hsl(var(--review-star))]' : 'fill-muted text-muted'}`}
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground font-medium">Basado en {stats.total} reseñas</p>
                </div>

                <div className="space-y-4">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = stats?.distribution?.[star] || 0;
                    const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-3 text-sm font-medium">
                        <div className="flex items-center gap-1 w-12 text-muted-foreground">
                          <span>{star}</span>
                          <Star className="w-3 h-3 fill-current" />
                        </div>
                        <Progress value={percentage} className="h-2.5 flex-1 bg-muted" />
                        <div className="w-8 text-right text-muted-foreground">{count}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Top Reviews */}
            <div className="lg:col-span-2">
              {loadingReviews ? (
                <div className="h-full flex items-center justify-center min-h-[300px]">
                  <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                </div>
              ) : topReviews.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {topReviews.map((review, idx) => (
                    <motion.div 
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <ReviewCard review={review} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-muted/30 rounded-3xl border border-border border-dashed">
                  <Star className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                  <h4 className="text-xl font-semibold mb-2">Aún no hay reseñas</h4>
                  <p className="text-muted-foreground mb-6">Sé el primero en compartir tu experiencia con FITJOB.</p>
                  <Link to="/reviews/new">
                    <Button>Escribir la primera reseña</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Candidatos Section */}
      <section className="py-20 bg-muted/50">
        <div className="container text-center max-w-2xl">
          <h2 className="text-3xl font-bold text-foreground mb-4">¿Buscas empleo?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Únete a nuestra base de talento y accede a oportunidades profesionales en empresas líderes que buscan perfiles como el tuyo.
          </p>
          <a href="https://forms.gle/p98HiR1LWUeCy45Z9" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="lg" className="rounded-full px-8 border-primary text-primary hover:bg-primary/10">
              Inscribirme como candidato
            </Button>
          </a>
        </div>
      </section>

      {/* Cierre Section */}
      <section className="py-24 bg-primary text-primary-foreground text-center">
        <div className="container max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Encuentra al candidato que necesitas
          </h2>
          <p className="text-lg md:text-xl mb-8 leading-relaxed opacity-95">
            Nos encargamos de publicar tu oferta, filtrar los CV y entrevistar a los candidatos para que tú solo tengas que elegir al mejor.
          </p>
          <Button 
            onClick={handleStartSelection}
            size="lg" 
            variant="secondary" 
            className="h-14 px-10 text-lg font-bold rounded-full text-primary hover:bg-white/90 shadow-xl transition-all active:scale-[0.98]"
          >
            Empezar proceso de selección
          </Button>
        </div>
      </section>
      
      <FormularioContratacion isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </>
  );
}