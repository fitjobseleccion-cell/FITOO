import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Briefcase, Users, Plus, MapPin, Calendar, Loader2, Lock, Unlock, FileText, Mail, Phone, AlertTriangle, Eye, Filter, Crown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';
import { DEFAULT_PLAN, DEFAULT_PLAN_LIMIT } from '@/lib/planConstants.js';
import { abreviarNombreCandidato } from '@/lib/formatters.js';
import { getDaysUntilExpiration, shouldNotifyExpiration } from '@/lib/planUtils.js';
import CandidatoPerfilModal from '@/components/CandidatoPerfilModal.jsx';
import BuscarCandidatos from '@/components/BuscarCandidatos.jsx';

const PanelEmpresa = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [empresaData, setEmpresaData] = useState(null);
  const [ofertas, setOfertas] = useState([]);
  const [candidatos, setCandidatos] = useState([]);
  const [planEmpresa, setPlanEmpresa] = useState(null);
  const [desbloqueos, setDesbloqueos] = useState([]);
  const [filtroOferta, setFiltroOferta] = useState('todas');

  const [selectedCandidatoPerfil, setSelectedCandidatoPerfil] = useState(null);
  const [isPerfilModalOpen, setIsPerfilModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!pb.authStore.isValid) {
        navigate('/login');
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const user = pb.authStore.model;

        const freshUserData = await pb.collection('users').getOne(user.id, { $autoCancel: false });
        setEmpresaData(freshUserData);

        const ofertasData = await pb.collection('ofertas').getFullList({
          filter: `admin_id = "${user.id}"`,
          sort: '-created',
          $autoCancel: false
        });

        const candidatosData = await pb.collection('candidatos').getFullList({
          expand: 'oferta_id',
          sort: '-created',
          $autoCancel: false
        });

        const myCandidatos = candidatosData.filter(c => 
          ofertasData.some(o => o.id === c.oferta_id)
        );

        setOfertas(ofertasData);
        setCandidatos(myCandidatos);

        let plan;
        try {
          plan = await pb.collection('company_plans').getFirstListItem(`admin_id = "${user.id}"`, { $autoCancel: false });
          plan = await verificarYResetearPeriodo(plan);
        } catch (err) {
          plan = await pb.collection('company_plans').create({
            admin_id: user.id,
            plan: DEFAULT_PLAN,
            limite_candidatos: DEFAULT_PLAN_LIMIT,
            limite_ofertas: 1, 
            candidatos_desbloqueados_mes: 0,
            fecha_inicio_periodo: new Date().toISOString()
          }, { $autoCancel: false });
        }
        setPlanEmpresa(plan);

        const unlocksData = await pb.collection('candidato_desbloqueos').getFullList({
          filter: `admin_id = "${user.id}"`,
          $autoCancel: false
        });
        setDesbloqueos(unlocksData);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('No se pudieron cargar los datos del panel.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const verificarYResetearPeriodo = async (planActual) => {
    const today = new Date();
    const startDate = new Date(planActual.fecha_inicio_periodo);
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 30) {
      try {
        const planActualizado = await pb.collection('company_plans').update(planActual.id, {
          candidatos_desbloqueados_mes: 0,
          fecha_inicio_periodo: today.toISOString()
        }, { $autoCancel: false });
        return planActualizado;
      } catch (e) {
        console.error('Error resetting plan period:', e);
        return planActual;
      }
    }
    return planActual;
  };

  const handleChangeEstadoCandidatura = async (candidaturaId, nuevoEstado) => {
    try {
      await pb.collection('candidatos').update(candidaturaId, { estado_candidatura: nuevoEstado }, { $autoCancel: false });
      
      const updatedCandidatos = candidatos.map(c => 
        c.id === candidaturaId ? { ...c, estado_candidatura: nuevoEstado } : c
      );
      setCandidatos(updatedCandidatos);
      
      if (selectedCandidatoPerfil && selectedCandidatoPerfil.id === candidaturaId) {
        setSelectedCandidatoPerfil(prev => ({ ...prev, estado_candidatura: nuevoEstado }));
      }
      toast.success('Estado actualizado correctamente');
    } catch (error) {
      toast.error('Error al actualizar el estado');
      throw error;
    }
  };

  const estaDesbloqueado = (candidatoId, ofertaId) => {
    if (planEmpresa?.plan === 'premium' || planEmpresa?.plan === 'empresa') return true;
    return desbloqueos.some(d => d.candidato_id === candidatoId && d.oferta_id === ofertaId);
  };

  const handleDesbloquearCandidato = async (candidatoId, ofertaId) => {
    if (estaDesbloqueado(candidatoId, ofertaId)) return Promise.resolve();

    if (planEmpresa.plan !== 'premium' && planEmpresa.plan !== 'empresa' && planEmpresa.candidatos_desbloqueados_mes >= planEmpresa.limite_candidatos) {
      toast.error('Has alcanzado el límite de desbloqueos de tu plan actual. Mejora tu plan para acceder a más candidatos.');
      return Promise.reject(new Error('Límite alcanzado'));
    }

    try {
      const user = pb.authStore.model;
      
      const nuevoDesbloqueo = await pb.collection('candidato_desbloqueos').create({
        admin_id: user.id,
        candidato_id: candidatoId,
        oferta_id: ofertaId
      }, { $autoCancel: false });

      const nuevosDesbloqueados = planEmpresa.candidatos_desbloqueados_mes + 1;
      const planActualizado = await pb.collection('company_plans').update(planEmpresa.id, {
        candidatos_desbloqueados_mes: nuevosDesbloqueados
      }, { $autoCancel: false });

      setDesbloqueos(prev => [...prev, nuevoDesbloqueo]);
      setPlanEmpresa(planActualizado);
      toast.success('Candidato desbloqueado con éxito');
      return Promise.resolve();
    } catch (e) {
      console.error('Error unlocking candidate:', e);
      toast.error('Ocurrió un error al desbloquear el candidato.');
      return Promise.reject(e);
    }
  };

  const handleOpenPerfilModal = (candidato) => {
    setSelectedCandidatoPerfil(candidato);
    setIsPerfilModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-muted/20">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Cargando panel...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="bg-destructive/10 text-destructive p-6 rounded-xl border border-destructive/20 text-center max-w-md">
          <p className="font-medium mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline" className="bg-background">Reintentar</Button>
        </div>
      </div>
    );
  }

  const isPremium = planEmpresa?.plan === 'premium' || planEmpresa?.plan === 'empresa';
  const progressValue = isPremium ? 100 : (planEmpresa.candidatos_desbloqueados_mes / planEmpresa.limite_candidatos) * 100;
  
  const resetDate = new Date(planEmpresa.fecha_inicio_periodo);
  resetDate.setDate(resetDate.getDate() + 30);

  const expirationWarning = planEmpresa?.plan_valido_hasta && shouldNotifyExpiration(planEmpresa.plan_valido_hasta);
  const daysLeft = expirationWarning ? getDaysUntilExpiration(planEmpresa.plan_valido_hasta) : null;
  const ofertasActivas = ofertas.filter(o => o.estado !== 'cerrada').length;

  const candidatosFiltrados = filtroOferta === 'todas' 
    ? candidatos 
    : candidatos.filter(c => c.oferta_id === filtroOferta);

  const currentUser = pb.authStore.model;

  return (
    <>
      <Helmet>
        <title>Panel de Empresa | FITJOB</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50/50 dark:bg-background/95 py-24">
        <div className="container max-w-7xl">
          
          {expirationWarning && (
            <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded-r-xl mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
              <div className="flex items-center gap-3 text-destructive">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <p className="font-medium">
                  Atención: Tu suscripción actual finalizará en {daysLeft} {daysLeft === 1 ? 'día' : 'días'}.
                </p>
              </div>
              <Button asChild variant="destructive" size="sm" className="whitespace-nowrap">
                <Link to="/planes-empresa">Renovar plan</Link>
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            <Card className="lg:col-span-2 border-primary/10 shadow-md overflow-hidden relative">
              <div className="absolute top-0 right-0 p-12 bg-primary/5 rounded-bl-[100px] -mr-8 -mt-8 z-0"></div>
              <CardContent className="p-8 relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="text-3xl font-bold text-foreground">Panel de Empresa</h1>
                  {empresaData?.verificado && (
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-0">
                      🟢 Verificada
                    </Badge>
                  )}
                </div>
                <p className="text-lg text-muted-foreground mb-8">
                  Bienvenido de nuevo, <span className="font-semibold text-primary">{empresaData?.name || 'Administrador'}</span>
                </p>
                <div className="flex gap-6">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">Total Ofertas</p>
                    <p className="text-3xl font-bold text-foreground">{ofertas.length}</p>
                  </div>
                  <div className="w-px bg-border"></div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">Candidatos Inscritos</p>
                    <p className="text-3xl font-bold text-foreground">{candidatos.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {planEmpresa && (
              <Card className="border-primary/20 shadow-md bg-gradient-to-br from-card to-muted/30">
                <CardContent className="p-8 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Plan actual</p>
                        <div className="flex items-center gap-2">
                          {isPremium && <Crown className="w-5 h-5 text-amber-500" />}
                          <h3 className="text-xl font-bold text-foreground capitalize">{planEmpresa.plan}</h3>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-background">
                        Activo
                      </Badge>
                    </div>

                    {!isPremium ? (
                      <div className="mb-6">
                        <div className="flex justify-between text-sm mb-2 font-medium">
                          <span className="text-muted-foreground">Desbloqueos usados</span>
                          <span className="text-foreground">{planEmpresa.candidatos_desbloqueados_mes} / {planEmpresa.limite_candidatos}</span>
                        </div>
                        <Progress value={progressValue} className="h-2 mb-2" />
                        <p className="text-xs text-muted-foreground">
                          Se reinicia el {resetDate.toLocaleDateString()}
                        </p>
                      </div>
                    ) : (
                      <div className="mb-6 p-3 bg-primary/10 rounded-xl border border-primary/20 flex items-center text-sm font-medium text-primary">
                        <Unlock className="w-4 h-4 mr-2" /> Acceso ilimitado a candidatos
                      </div>
                    )}
                  </div>
                  
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/planes-empresa">Gestionar Suscripción</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <Tabs defaultValue="ofertas" className="w-full">
            <div className="flex justify-between items-center mb-6 overflow-x-auto pb-2 custom-scrollbar">
              <TabsList className="flex w-max sm:w-[750px] shrink-0">
                <TabsTrigger value="ofertas" className="flex-1 text-sm sm:text-base">Mis Ofertas</TabsTrigger>
                <TabsTrigger value="candidatos" className="flex-1 text-sm sm:text-base">Lista Candidatos</TabsTrigger>
                <TabsTrigger value="buscar" className="flex-1 text-sm sm:text-base flex items-center gap-2">
                  <Search className="w-4 h-4" /> Buscar Candidatos
                </TabsTrigger>
              </TabsList>
            </div>

            {/* TAB: OFERTAS */}
            <TabsContent value="ofertas" className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Ofertas publicadas</h2>
                  <p className="text-muted-foreground">
                    Tienes {ofertasActivas} de {planEmpresa?.limite_ofertas || 1} ofertas activas.
                  </p>
                </div>
                <Button 
                  size="lg"
                  onClick={() => {
                    if (ofertasActivas >= (planEmpresa?.limite_ofertas || 1)) {
                      toast.error(`Has alcanzado el límite de ${planEmpresa?.limite_ofertas || 1} ofertas activas de tu plan. Cierra una oferta o mejora tu plan.`);
                    } else {
                      navigate('/crear-oferta');
                    }
                  }}
                  className="w-full sm:w-auto shadow-md"
                >
                  <Plus className="w-5 h-5 mr-2" /> Publicar nueva oferta
                </Button>
              </div>

              {ofertas.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {ofertas.map(oferta => {
                    const count = candidatos.filter(c => c.oferta_id === oferta.id).length;
                    
                    let badgeColor = "bg-slate-100 text-slate-800";
                    if (oferta.estado === 'publicada') badgeColor = "bg-emerald-100 text-emerald-800 border-emerald-200";
                    if (oferta.estado === 'pausada') badgeColor = "bg-amber-100 text-amber-800 border-amber-200";
                    if (oferta.estado === 'cerrada') badgeColor = "bg-red-100 text-red-800 border-red-200";

                    return (
                      <Card key={oferta.id} className="hover:shadow-lg transition-all duration-300 flex flex-col">
                        <CardContent className="p-6 flex-1 flex flex-col">
                          <div className="flex justify-between items-start mb-4 gap-4">
                            <h3 className="text-xl font-bold text-foreground line-clamp-2">{oferta.titulo}</h3>
                            <Badge variant="outline" className={`whitespace-nowrap capitalize ${badgeColor}`}>
                              {oferta.estado}
                            </Badge>
                          </div>
                          
                          <div className="space-y-3 mb-6 mt-auto">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="w-4 h-4 mr-2" /> {oferta.ubicacion}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4 mr-2" /> Publicada el {new Date(oferta.created).toLocaleDateString()}
                            </div>
                            <div className="flex items-center text-sm font-semibold text-primary bg-primary/5 p-2 rounded-lg border border-primary/10">
                              <Users className="w-4 h-4 mr-2" /> {count} candidatos inscritos
                            </div>
                          </div>
                          
                          <div className="pt-4 border-t border-border mt-auto">
                            <Button variant="outline" className="w-full" onClick={() => navigate(`/ofertas-de-trabajo/${oferta.id}`)}>
                              <Eye className="w-4 h-4 mr-2" /> Ver pública
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-20 bg-card border border-dashed rounded-3xl">
                  <Briefcase className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
                  <h3 className="text-xl font-bold text-foreground mb-3">Aún no tienes ofertas</h3>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">Publica tu primera oferta de empleo para empezar a recibir candidatos cualificados en tu panel.</p>
                  <Button size="lg" onClick={() => navigate('/crear-oferta')} className="shadow-lg">
                    Publicar primera oferta
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* TAB: CANDIDATOS */}
            <TabsContent value="candidatos" className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h2 className="text-2xl font-bold text-foreground">Lista de Candidatos</h2>
                
                {ofertas.length > 1 && (
                  <div className="flex items-center gap-3 w-full sm:w-auto bg-card p-2 rounded-xl border shadow-sm">
                    <Filter className="w-4 h-4 text-muted-foreground ml-2" />
                    <Select value={filtroOferta} onValueChange={setFiltroOferta}>
                      <SelectTrigger className="w-full sm:w-[250px] border-0 bg-transparent shadow-none focus:ring-0">
                        <SelectValue placeholder="Filtrar por oferta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todas">Todas las ofertas</SelectItem>
                        {ofertas.map(o => (
                          <SelectItem key={o.id} value={o.id}>{o.titulo}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {candidatosFiltrados.length > 0 ? (
                <div className="grid gap-6">
                  {candidatosFiltrados.map(candidato => {
                    const desbloqueado = estaDesbloqueado(candidato.id, candidato.oferta_id);
                    const nombreMostrar = desbloqueado 
                      ? `${candidato.nombre} ${candidato.apellidos}`
                      : abreviarNombreCandidato(candidato.nombre, candidato.apellidos);
                    
                    return (
                      <Card key={candidato.id} className="hover:shadow-md transition-all overflow-hidden border-border/60">
                        <div className="flex flex-col md:flex-row">
                          
                          <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex flex-wrap items-center gap-3 mb-1">
                                <h3 className="text-xl font-bold text-foreground">{nombreMostrar}</h3>
                                {desbloqueado ? (
                                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                    <Unlock className="w-3 h-3 mr-1" /> Desbloqueado
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200">
                                    <Lock className="w-3 h-3 mr-1" /> Bloqueado
                                  </Badge>
                                )}
                                {candidato.verificado && (
                                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-0 text-xs">
                                    ✓ Verificado
                                  </Badge>
                                )}
                              </div>

                              {candidato.expand?.oferta_id && (
                                <p className="text-sm font-medium text-primary flex items-center mt-3">
                                  <Briefcase className="w-4 h-4 mr-2" />
                                  Aplicó a: {candidato.expand.oferta_id.titulo}
                                </p>
                              )}

                              <button 
                                onClick={() => handleOpenPerfilModal(candidato)}
                                className="text-xs text-primary hover:underline font-semibold mb-4 inline-block mt-1"
                              >
                                Ver perfil completo
                              </button>

                              <div className="text-sm text-muted-foreground flex items-center mb-6">
                                <MapPin className="w-4 h-4 mr-2" /> {candidato.ciudad}, {candidato.provincia}
                              </div>
                            </div>

                            {desbloqueado ? (
                              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center text-sm">
                                  <Mail className="w-4 h-4 text-primary mr-3" />
                                  <a href={`mailto:${candidato.email}`} className="font-medium hover:underline hover:text-primary transition-colors break-all">{candidato.email}</a>
                                </div>
                                <div className="flex items-center text-sm">
                                  <Phone className="w-4 h-4 text-primary mr-3" />
                                  <a href={`tel:${candidato.telefono}`} className="font-medium hover:underline hover:text-primary transition-colors">{candidato.telefono}</a>
                                </div>
                                {candidato.curriculum && (
                                  <div className="sm:col-span-2 pt-2">
                                    <Button variant="outline" size="sm" asChild>
                                      <a href={pb.files.getURL(candidato, candidato.curriculum)} target="_blank" rel="noopener noreferrer">
                                        <FileText className="w-4 h-4 mr-2" /> Descargar Currículum
                                      </a>
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="bg-muted/40 rounded-xl p-5 border border-dashed text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div>
                                  <p className="font-medium text-foreground mb-1">Información de contacto oculta</p>
                                  <p className="text-sm text-muted-foreground">Usa un crédito para ver su CV, email y teléfono.</p>
                                </div>
                                <Button 
                                  onClick={() => handleDesbloquearCandidato(candidato.id, candidato.oferta_id)}
                                  className="w-full sm:w-auto shadow-sm"
                                >
                                  <Unlock className="w-4 h-4 mr-2" /> Desbloquear candidato
                                </Button>
                              </div>
                            )}
                          </div>
                          
                          <div className="bg-muted/20 p-6 md:p-8 md:w-64 border-t md:border-t-0 md:border-l flex flex-col justify-center">
                            <p className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Estado del proceso</p>
                            <Select value={candidato.estado_candidatura} onValueChange={(val) => handleChangeEstadoCandidatura(candidato.id, val)}>
                              <SelectTrigger className="w-full bg-background font-medium">
                                <SelectValue placeholder="Estado" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="recibido">Recibido</SelectItem>
                                <SelectItem value="en_revision">En revisión</SelectItem>
                                <SelectItem value="preseleccionado">Preseleccionado</SelectItem>
                                <SelectItem value="entrevista">Entrevista</SelectItem>
                                <SelectItem value="finalista">Finalista</SelectItem>
                                <SelectItem value="contratado">Contratado</SelectItem>
                                <SelectItem value="descartado">Descartado</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            {candidato.estado_candidatura === 'descartado' && candidato.motivo_descarte && (
                              <div className="mt-4 p-3 bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300 rounded-lg text-xs font-medium border border-red-100 dark:border-red-900/50">
                                <span className="block text-red-900/60 dark:text-red-400/60 mb-1">Motivo:</span>
                                {candidato.motivo_descarte}
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-20 bg-card border border-dashed rounded-3xl">
                  <Users className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
                  <h3 className="text-xl font-bold text-foreground mb-3">No hay candidatos para mostrar</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {filtroOferta !== 'todas' 
                      ? "Aún no hay inscripciones para esta oferta específica."
                      : "Los candidatos que se inscriban a tus ofertas aparecerán aquí."}
                  </p>
                </div>
              )}
            </TabsContent>

            {/* TAB: BUSCAR CANDIDATOS */}
            <TabsContent value="buscar" className="space-y-6 pt-4">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground">Explorar Base de Candidatos</h2>
                <p className="text-muted-foreground mt-1">Busca y filtra entre todos los candidatos disponibles para encontrar el perfil ideal.</p>
              </div>
              <BuscarCandidatos 
                empresaId={currentUser?.id} 
                usuarioActualId={currentUser?.id} 
                onDesbloquear={handleDesbloquearCandidato} 
                onChangeEstado={handleChangeEstadoCandidatura} 
              />
            </TabsContent>

          </Tabs>

        </div>
      </div>

      <CandidatoPerfilModal 
        isOpen={isPerfilModalOpen}
        onClose={() => setIsPerfilModalOpen(false)}
        candidato={selectedCandidatoPerfil}
        empresaId={currentUser?.id}
        usuarioActualId={currentUser?.id}
        onDesbloquear={handleDesbloquearCandidato}
        onChangeEstado={handleChangeEstadoCandidatura}
      />
    </>
  );
};

export default PanelEmpresa;