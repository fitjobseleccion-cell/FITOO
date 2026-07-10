import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Loader2, Mail, Users, XCircle, SearchX, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';
import DescarteModal from '@/components/DescarteModal.jsx';
import CandidatoPerfilModal from '@/components/CandidatoPerfilModal.jsx';

export default function CandidatosPanel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidatos, setCandidatos] = useState([]);
  const [oferta, setOferta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [planEmpresa, setPlanEmpresa] = useState(null);
  const [desbloqueos, setDesbloqueos] = useState([]);

  const [selectedCandidato, setSelectedCandidato] = useState(null);
  const [isDescarteModalOpen, setIsDescarteModalOpen] = useState(false);

  const [selectedCandidatoPerfil, setSelectedCandidatoPerfil] = useState(null);
  const [isPerfilModalOpen, setIsPerfilModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const user = pb.authStore.model;

      // 1. Fetch oferta para el título
      const ofertaRecord = await pb.collection('ofertas').getOne(id, { $autoCancel: false });
      setOferta(ofertaRecord);

      // 2. Fetch candidatos de esta oferta con usuario expandido
      const candidatosList = await pb.collection('candidatos').getFullList({
        filter: `oferta_id="${id}"`,
        expand: 'usuario_id',
        sort: '-created',
        $autoCancel: false
      });
      setCandidatos(candidatosList);

      // 3. Fetch company plan
      if (user) {
        try {
          const plan = await pb.collection('company_plans').getFirstListItem(`admin_id = "${user.id}"`, { $autoCancel: false });
          setPlanEmpresa(plan);
        } catch (err) {
          console.log('No company plan found');
        }

        // 4. Fetch unlocks
        const unlocksData = await pb.collection('candidato_desbloqueos').getFullList({
          filter: `admin_id = "${user.id}"`,
          $autoCancel: false
        });
        setDesbloqueos(unlocksData);
      }

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('No se pudieron cargar los datos de esta oferta.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const estaDesbloqueado = (candidatoId, ofertaId) => {
    if (planEmpresa?.plan === 'premium' || planEmpresa?.plan === 'empresa') return true;
    return desbloqueos.some(d => d.candidato_id === candidatoId && d.oferta_id === ofertaId);
  };

  const desbloquearCandidato = async (candidatoId, ofertaId) => {
    if (estaDesbloqueado(candidatoId, ofertaId)) return;

    if (planEmpresa.plan !== 'premium' && planEmpresa.plan !== 'empresa' && planEmpresa.candidatos_desbloqueados_mes >= planEmpresa.limite_candidatos) {
      toast.error('Has alcanzado el límite de desbloqueos de tu plan actual. Mejora tu plan para acceder a más candidatos.');
      return;
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
    } catch (e) {
      console.error('Error unlocking candidate:', e);
      toast.error('Ocurrió un error al desbloquear el candidato.');
    }
  };

  const handleOpenDescarte = (candidato) => {
    setSelectedCandidato(candidato);
    setIsDescarteModalOpen(true);
  };

  const handleOpenPerfilModal = (candidato) => {
    setSelectedCandidatoPerfil(candidato);
    setIsPerfilModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 dark:bg-background pt-24 pb-20 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium">Cargando candidatos...</p>
      </div>
    );
  }

  if (error || !oferta) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">{error}</h2>
        <Button onClick={() => navigate('/panel-empresa')}>Volver al Panel</Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Candidatos - {oferta.titulo} | Panel de Empresa</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50/50 dark:bg-background pt-24 pb-20">
        <div className="container max-w-5xl">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/panel-empresa')}
            className="mb-6 hover:bg-transparent hover:text-primary pl-0 text-muted-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Panel
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
              Candidatos
            </h1>
            <p className="text-lg text-muted-foreground mt-1 flex items-center gap-2">
              <span className="font-semibold text-foreground">{oferta.titulo}</span>
              <span className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-md font-medium">
                {candidatos.length} total
              </span>
            </p>
          </div>

          {candidatos.length > 0 ? (
            <div className="grid gap-4">
              {candidatos.map((candidato) => {
                const isDescartado = candidato.estado_candidatura === 'descartado';
                const statusColor = isDescartado 
                  ? 'bg-destructive/10 text-destructive border-transparent' 
                  : 'bg-blue-100 text-blue-800 border-transparent dark:bg-blue-900/40 dark:text-blue-300';
                
                const statusLabel = candidato.estado_candidatura.charAt(0).toUpperCase() + candidato.estado_candidatura.slice(1).replace('_', ' ');

                return (
                  <div key={candidato.id} className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-foreground">
                          {candidato.nombre} {candidato.apellidos}
                        </h3>
                        <Badge variant="outline" className={statusColor}>
                          {statusLabel}
                        </Badge>
                      </div>
                      
                      <button 
                        onClick={() => handleOpenPerfilModal(candidato)}
                        className="text-xs text-primary hover:underline font-semibold mb-3 block"
                      >
                        Ver perfil completo
                      </button>
                      
                      {estaDesbloqueado(candidato.id, candidato.oferta_id) ? (
                        <div className="flex items-center text-sm text-muted-foreground mb-3">
                          <Mail className="w-4 h-4 mr-1.5" />
                          <a href={`mailto:${candidato.email}`} className="hover:underline hover:text-primary transition-colors">
                            {candidato.email}
                          </a>
                        </div>
                      ) : (
                        <div className="bg-muted/40 rounded-xl p-4 border border-dashed text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 mb-3">
                          <div>
                            <p className="font-medium text-foreground mb-1 text-sm">Información de contacto oculta</p>
                          </div>
                          <Button 
                            size="sm"
                            onClick={() => desbloquearCandidato(candidato.id, candidato.oferta_id)}
                            className="w-full sm:w-auto shadow-sm"
                          >
                            <Unlock className="w-4 h-4 mr-2" /> Desbloquear candidato
                          </Button>
                        </div>
                      )}

                      {isDescartado && candidato.motivo_descarte && (
                        <div className="bg-destructive/5 text-destructive/80 text-sm px-3 py-2 rounded-lg border border-destructive/10 inline-flex">
                          <strong>Motivo:</strong>&nbsp;{candidato.motivo_descarte}
                        </div>
                      )}
                    </div>

                    <div className="w-full md:w-auto shrink-0 border-t md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0 flex gap-2 justify-end">
                      {!isDescartado && (
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleOpenDescarte(candidato)}
                          className="w-full md:w-auto"
                        >
                          <XCircle className="w-4 h-4 mr-1.5" />
                          Descartar
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-card border border-dashed rounded-3xl p-12 text-center">
              <SearchX className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Sin candidatos</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Aún no hay personas inscritas en esta oferta. Vuelve más tarde cuando la oferta tenga mayor visibilidad.
              </p>
            </div>
          )}
        </div>
      </div>

      <DescarteModal 
        isOpen={isDescarteModalOpen}
        onClose={() => setIsDescarteModalOpen(false)}
        candidato={selectedCandidato}
        onSuccess={fetchData}
      />

      <CandidatoPerfilModal 
        isOpen={isPerfilModalOpen}
        onClose={() => setIsPerfilModalOpen(false)}
        candidato={selectedCandidatoPerfil}
      />
    </>
  );
}