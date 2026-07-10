import React, { useState, useEffect } from 'react';
import { Loader2, MapPin, Briefcase, Mail, Phone, FileText, Lock, Unlock, AlertCircle, Copy, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';
import NotasInternas from '@/components/NotasInternas.jsx';
import HistorialCandidaturas from '@/components/HistorialCandidaturas.jsx';

const CandidatoPerfilModal = ({ 
  isOpen, 
  onClose, 
  candidato, 
  empresaId, 
  usuarioActualId,
  onDesbloquear,
  onChangeEstado 
}) => {
  const [loading, setLoading] = useState(true);
  const [cvData, setCvData] = useState(null);
  const [respuestas, setRespuestas] = useState([]);
  const [userData, setUserData] = useState(null);
  
  // Unlock state
  const [estaDesbloqueado, setEstaDesbloqueado] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  // Copy state
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!isOpen || !candidato) return;
      setLoading(true);
      try {
        // Fetch User and CV
        if (candidato.usuario_id) {
          try {
            const uData = await pb.collection('users').getOne(candidato.usuario_id, { $autoCancel: false });
            setUserData(uData);
          } catch (e) {
            console.error('Error fetching user data', e);
          }

          try {
            const drafts = await pb.collection('cv_drafts').getFullList({
              filter: `userId = "${candidato.usuario_id}"`,
              $autoCancel: false
            });
            if (drafts.length > 0) {
              setCvData(drafts[0].formData);
            } else {
              setCvData(null);
            }
          } catch (e) {
            console.error('Error fetching cv_drafts', e);
          }
        } else {
          setCvData(null);
        }

        // Fetch Screening Answers
        try {
          const resp = await pb.collection('respuestas').getFullList({
            filter: `candidato_id = "${candidato.id}" && oferta_id = "${candidato.oferta_id}"`,
            expand: 'pregunta_id',
            $autoCancel: false
          });
          setRespuestas(resp);
        } catch (e) {
          console.error('Error fetching respuestas', e);
        }

        // Determine if unlocked
        if (empresaId) {
          const plan = await pb.collection('company_plans').getFirstListItem(`admin_id = "${empresaId}"`, { $autoCancel: false }).catch(() => null);
          if (plan && (plan.plan === 'premium' || plan.plan === 'empresa')) {
            setEstaDesbloqueado(true);
          } else {
            const desbloqueo = await pb.collection('candidato_desbloqueos').getFirstListItem(
              `admin_id = "${empresaId}" && candidato_id = "${candidato.id}" && oferta_id = "${candidato.oferta_id}"`,
              { $autoCancel: false }
            ).catch(() => null);
            setEstaDesbloqueado(!!desbloqueo);
          }
        } else {
          setEstaDesbloqueado(true); // default if no context
        }

      } catch (err) {
        console.error("Error in profile modal fetch", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen, candidato, empresaId]);

  if (!candidato) return null;

  const handleDesbloquear = async () => {
    if (!onDesbloquear) return;
    setUnlocking(true);
    try {
      await onDesbloquear(candidato.id, candidato.oferta_id);
      setEstaDesbloqueado(true);
    } catch (e) {
      console.error(e);
    } finally {
      setUnlocking(false);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
    toast.success('Copiado al portapapeles');
  };

  const initials = `${candidato.nombre?.charAt(0) || ''}${candidato.apellidos?.charAt(0) || ''}`.toUpperCase();
  const avatarUrl = userData?.avatar ? pb.files.getURL(userData, userData.avatar) : null;
  const nombreMostrar = (!estaDesbloqueado && empresaId) ? `${candidato.nombre} ${candidato.apellidos?.charAt(0)}.` : `${candidato.nombre} ${candidato.apellidos}`;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-background">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground font-medium">Cargando perfil del candidato...</p>
          </div>
        ) : (
          <>
            {/* Header Section */}
            <DialogHeader className="p-6 border-b border-border/50 bg-muted/10 relative shrink-0">
              <div className="flex flex-col md:flex-row items-start gap-6 pr-8">
                <Avatar className="w-20 h-20 border-2 border-background shadow-md shrink-0">
                  <AvatarImage src={avatarUrl || ''} />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary font-bold">{initials}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex flex-col gap-1 mb-3">
                    <DialogTitle className="text-2xl md:text-3xl font-bold flex items-center gap-3 truncate">
                      {nombreMostrar}
                      {!estaDesbloqueado && empresaId && (
                        <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200 shrink-0 text-xs py-0.5">
                          <Lock className="w-3 h-3 mr-1" /> Oculto
                        </Badge>
                      )}
                    </DialogTitle>
                    {cvData?.summary && <p className="text-primary font-medium text-sm line-clamp-1">{cvData.experience?.[0]?.position || 'Profesional en búsqueda'}</p>}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center font-medium bg-background px-2.5 py-1 rounded-md border shadow-sm">
                      <MapPin className="w-3.5 h-3.5 mr-1.5" />
                      {candidato.ciudad}{candidato.provincia ? `, ${candidato.provincia}` : ''}
                    </span>
                    {candidato.verificado && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-0">
                        ✓ Identidad Verificada
                      </Badge>
                    )}
                    {candidato.permiso_trabajo === 'sí' && (
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        Permiso de trabajo válido
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Close/Action buttons top right */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  {candidato.curriculum && estaDesbloqueado && (
                    <Button variant="outline" size="sm" asChild className="hidden md:flex">
                      <a href={pb.files.getURL(candidato, candidato.curriculum)} target="_blank" rel="noopener noreferrer">
                        <FileText className="w-4 h-4 mr-2" /> CV original
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </DialogHeader>

            <ScrollArea className="flex-1 bg-slate-50/50 dark:bg-background">
              <div className="p-6 max-w-4xl mx-auto space-y-6">
                
                {/* Contact Info Card */}
                {empresaId && !estaDesbloqueado ? (
                  <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                      <h4 className="text-base font-bold text-foreground mb-1 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-primary" /> Información de contacto protegida
                      </h4>
                      <p className="text-sm text-muted-foreground max-w-lg">
                        Desbloquea este candidato para acceder a su email, teléfono, currículum en PDF y todo el detalle de su perfil profesional.
                      </p>
                    </div>
                    <Button 
                      onClick={handleDesbloquear} 
                      disabled={unlocking}
                      className="w-full sm:w-auto shrink-0 shadow-md"
                      size="lg"
                    >
                      {unlocking ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Unlock className="w-5 h-5 mr-2" />}
                      Desbloquear ahora
                    </Button>
                  </div>
                ) : (
                  <div className="bg-card rounded-2xl p-5 border shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-muted/40 rounded-xl border border-border/50">
                      <div className="flex items-center min-w-0">
                        <div className="bg-primary/10 p-2 rounded-lg mr-3">
                          <Mail className="w-4 h-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground font-medium mb-0.5">Correo electrónico</p>
                          <p className="text-sm font-medium text-foreground truncate max-w-[200px]" title={candidato.email}>{candidato.email}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => copyToClipboard(candidato.email, 'email')} className="shrink-0 h-8 w-8">
                        {copiedEmail ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-muted/40 rounded-xl border border-border/50">
                      <div className="flex items-center min-w-0">
                        <div className="bg-primary/10 p-2 rounded-lg mr-3">
                          <Phone className="w-4 h-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground font-medium mb-0.5">Teléfono</p>
                          <p className="text-sm font-medium text-foreground">{candidato.telefono}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => copyToClipboard(candidato.telefono, 'phone')} className="shrink-0 h-8 w-8">
                        {copiedPhone ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Main Content Tabs */}
                <Tabs defaultValue="perfil" className="w-full">
                  <TabsList className="w-full flex justify-start bg-muted/50 p-1 mb-6 rounded-xl overflow-x-auto hide-scrollbar">
                    <TabsTrigger value="perfil" className="rounded-lg px-4">Perfil Profesional</TabsTrigger>
                    {respuestas.length > 0 && (
                      <TabsTrigger value="respuestas" className="rounded-lg px-4">Cuestionario</TabsTrigger>
                    )}
                    {empresaId && estaDesbloqueado && (
                      <>
                        <TabsTrigger value="notas" className="rounded-lg px-4">Notas Internas</TabsTrigger>
                        <TabsTrigger value="historial" className="rounded-lg px-4">Historial</TabsTrigger>
                      </>
                    )}
                  </TabsList>

                  <TabsContent value="perfil" className="focus-visible:outline-none">
                    {estaDesbloqueado ? (
                      cvData ? (
                        <div className="space-y-8 pb-8">
                          {cvData.summary && (
                            <section className="bg-card border rounded-2xl p-6 shadow-sm">
                              <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Sobre mí
                              </h4>
                              <p className="text-muted-foreground whitespace-pre-wrap text-sm leading-relaxed">
                                {cvData.summary}
                              </p>
                            </section>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 space-y-8">
                              {cvData.experience && cvData.experience.length > 0 && (
                                <section>
                                  <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-5 flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-muted-foreground" /> Experiencia
                                  </h4>
                                  <div className="space-y-6">
                                    {cvData.experience.map((exp, i) => (
                                      <div key={i} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-px before:bg-border last:before:bottom-auto last:before:h-full">
                                        <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-primary/40 ring-4 ring-background" />
                                        <div className="bg-card border rounded-xl p-5 shadow-sm">
                                          <h5 className="font-bold text-foreground text-base mb-1">{exp.position}</h5>
                                          <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-primary mb-3">
                                            <span>{exp.company}</span>
                                            <span className="text-muted-foreground">•</span>
                                            <span className="text-muted-foreground">{exp.startDate} - {exp.current ? 'Actualidad' : exp.endDate}</span>
                                          </div>
                                          {exp.description && (
                                            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                              {exp.description}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </section>
                              )}
                            </div>

                            <div className="space-y-6">
                              {cvData.skills && cvData.skills.length > 0 && (
                                <section className="bg-card border rounded-2xl p-6 shadow-sm">
                                  <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">Habilidades</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {cvData.skills.map((skill, i) => (
                                      <Badge key={i} variant="secondary" className="bg-primary/5 hover:bg-primary/10 border-primary/10 text-primary-foreground">
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                </section>
                              )}
                              
                              <section className="bg-card border rounded-2xl p-6 shadow-sm">
                                <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">Disponibilidad</h4>
                                <div className="space-y-3 text-sm">
                                  {cvData.personalDetails?.disponibilidad && (
                                    <div>
                                      <span className="text-muted-foreground block mb-1 text-xs font-medium">Disponibilidad</span>
                                      <span className="font-medium">{cvData.personalDetails.disponibilidad}</span>
                                    </div>
                                  )}
                                  {cvData.personalDetails?.jornada && (
                                    <div>
                                      <span className="text-muted-foreground block mb-1 text-xs font-medium">Jornada preferida</span>
                                      <span className="font-medium capitalize">{cvData.personalDetails.jornada}</span>
                                    </div>
                                  )}
                                  {cvData.personalDetails?.tipo_contrato && (
                                    <div>
                                      <span className="text-muted-foreground block mb-1 text-xs font-medium">Contrato preferido</span>
                                      <span className="font-medium capitalize">{cvData.personalDetails.tipo_contrato}</span>
                                    </div>
                                  )}
                                </div>
                              </section>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-16 bg-card border border-dashed rounded-2xl">
                          <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                          <h3 className="text-lg font-bold text-foreground mb-2">Perfil no detallado</h3>
                          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                            Este candidato no ha completado su perfil detallado con nuestro creador de CV, pero puedes descargar su archivo original.
                          </p>
                          {candidato.curriculum && (
                            <Button variant="outline" className="mt-6" asChild>
                              <a href={pb.files.getURL(candidato, candidato.curriculum)} target="_blank" rel="noopener noreferrer">
                                Descargar CV original
                              </a>
                            </Button>
                          )}
                        </div>
                      )
                    ) : (
                      <div className="text-center py-16">
                        <Lock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-muted-foreground">Desbloquea al candidato para ver su perfil completo</h3>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="respuestas" className="focus-visible:outline-none">
                     <div className="grid gap-4 pb-8">
                        {respuestas.map((r, i) => (
                          <div key={i} className="bg-card border rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-muted/30 px-5 py-4 border-b border-border/50">
                              <p className="text-sm font-semibold text-foreground">
                                {r.expand?.pregunta_id?.pregunta || 'Pregunta de cribado'}
                              </p>
                            </div>
                            <div className="p-5 bg-background">
                              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                {r.respuesta}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                  </TabsContent>

                  {empresaId && estaDesbloqueado && (
                    <>
                      <TabsContent value="notas" className="focus-visible:outline-none pb-8">
                        <NotasInternas 
                          candidatoId={candidato.id} 
                          empresaId={empresaId} 
                          usuarioActualId={usuarioActualId} 
                        />
                      </TabsContent>
                      
                      <TabsContent value="historial" className="focus-visible:outline-none pb-8">
                        <HistorialCandidaturas 
                          candidatoId={candidato.id} 
                          empresaId={empresaId} 
                          usuarioId={candidato.usuario_id} 
                          onChangeEstado={onChangeEstado} 
                        />
                      </TabsContent>
                    </>
                  )}
                </Tabs>

              </div>
            </ScrollArea>
            
            {/* Modal Footer Actions */}
            <div className="p-4 border-t bg-card flex justify-end gap-3 shrink-0">
              <Button variant="outline" onClick={onClose}>Cerrar panel</Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CandidatoPerfilModal;