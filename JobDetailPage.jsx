import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import pb from '@/lib/pocketbaseClient';
import { MapPin, Briefcase, Clock, CalendarDays, Euro, Building2, ArrowLeft, Share2, Flag, CheckCircle2, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const JobDetailPage = () => {
  // All hooks at top
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const record = await pb.collection('ofertas').getOne(id, { $autoCancel: false });
        setJob(record);

        const qs = await pb.collection('preguntas_cribado').getFullList({
          filter: `oferta_id="${id}"`,
          sort: 'orden',
          $autoCancel: false
        });
        setQuestions(qs);
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobData();
  }, [id]);

  // Logic after hooks
  if (loading) {
    return (
      <div className="container max-w-5xl pt-32 pb-24">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-16 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold mb-4">Oferta no encontrada</h1>
        <p className="text-muted-foreground mb-8">La oferta que buscas no existe o ha sido eliminada.</p>
        <Link to="/ofertas-de-trabajo"><Button>Volver a ofertas</Button></Link>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getSalaryRange = () => {
    if (!job.salario_minimo && !job.salario_maximo) return 'Salario no especificado';
    if (job.salario_minimo && job.salario_maximo) return `${job.salario_minimo}€ - ${job.salario_maximo}€ brutos/año`;
    if (job.salario_minimo) return `Desde ${job.salario_minimo}€ brutos/año`;
    return `Hasta ${job.salario_maximo}€ brutos/año`;
  };

  return (
    <div className="bg-muted/10 min-h-screen pt-28 pb-24">
      <Helmet>
        <title>{`${job.puesto || job.titulo} en ${job.empresa} | FITJOB`}</title>
      </Helmet>

      <div className="container max-w-6xl">
        <Link to="/ofertas-de-trabajo" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver a ofertas
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
              <div className="flex flex-wrap gap-2 mb-6">
                {job.destacada && <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Destacada</Badge>}
                {job.urgente && <Badge variant="destructive">Urgente</Badge>}
                {job.incorporacion_inmediata && <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Incorporación inmediata</Badge>}
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4 leading-tight">{job.puesto || job.titulo}</h1>
              
              <div className="flex items-center text-lg text-muted-foreground mb-8 font-medium">
                <Building2 className="w-5 h-5 mr-2 text-primary" /> {job.empresa}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-border mb-8">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground flex items-center"><MapPin className="w-4 h-4 mr-1" /> Ubicación</div>
                  <div className="font-semibold text-foreground">{job.ciudad} {job.modalidad && <span className="block text-xs font-normal text-muted-foreground">{job.modalidad}</span>}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground flex items-center"><Briefcase className="w-4 h-4 mr-1" /> Contrato</div>
                  <div className="font-semibold text-foreground capitalize">{job.tipo_contrato}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground flex items-center"><Clock className="w-4 h-4 mr-1" /> Jornada</div>
                  <div className="font-semibold text-foreground capitalize">{job.jornada}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground flex items-center"><Euro className="w-4 h-4 mr-1" /> Salario</div>
                  <div className="font-semibold text-foreground text-sm">{getSalaryRange()}</div>
                </div>
              </div>

              <div className="prose prose-slate max-w-none">
                <h3 className="text-xl font-bold text-foreground mb-4">Descripción del puesto</h3>
                <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed mb-8">{job.descripcion}</div>

                {job.funciones && (
                  <><h3 className="text-xl font-bold text-foreground mb-4">Funciones principales</h3>
                  <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed mb-8">{job.funciones}</div></>
                )}
                {job.requisitos && (
                  <><h3 className="text-xl font-bold text-foreground mb-4">Requisitos</h3>
                  <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed mb-8">{job.requisitos}</div></>
                )}
                {job.beneficios && (
                  <><h3 className="text-xl font-bold text-foreground mb-4">Beneficios</h3>
                  <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed mb-8">{job.beneficios}</div></>
                )}
              </div>

              {questions.length > 0 && (
                <div className="mt-12 pt-8 border-t border-border">
                  <h3 className="text-xl font-bold text-foreground mb-6 flex items-center">
                    <HelpCircle className="w-5 h-5 mr-2 text-primary" />
                    Preguntas de candidatura
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Esta oferta requiere responder las siguientes preguntas durante el proceso de inscripción:
                  </p>
                  <ul className="space-y-3">
                    {questions.map((q, idx) => (
                      <li key={q.id} className="flex items-start text-muted-foreground bg-muted/50 p-4 rounded-xl border border-border/50">
                        <span className="font-medium mr-2 text-foreground">{idx + 1}.</span>
                        <span className="flex-1">{q.pregunta}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm sticky top-28">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                  <Briefcase className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold mb-2">Resumen de la oferta</h3>
                <p className="text-sm text-muted-foreground mb-1">Publicada: {formatDate(job.fecha_publicacion || job.created)}</p>
                <p className="text-sm text-muted-foreground">Vacantes: {job.vacantes || 1}</p>
              </div>

              <div className="space-y-4 pt-6 border-t border-border">
                <Link to={`/ofertas-de-trabajo/${job.id}/candidatura`} className="block w-full">
                  <Button size="lg" className="w-full font-bold shadow-md rounded-xl h-14 text-lg">
                    Aplicar ahora
                  </Button>
                </Link>
                
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 rounded-xl"><Share2 className="w-4 h-4 mr-2" /> Compartir</Button>
                  <Button variant="outline" className="flex-1 rounded-xl"><Flag className="w-4 h-4 mr-2" /> Reportar</Button>
                </div>
              </div>

              <div className="mt-8 bg-muted/50 rounded-xl p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Garantizamos la privacidad de tus datos. La empresa solo tendrá acceso a la información estrictamente necesaria.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;