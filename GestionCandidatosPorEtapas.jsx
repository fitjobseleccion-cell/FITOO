import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';
import TarjetaCandidato from '@/components/TarjetaCandidato.jsx';
import CandidatoPerfilModal from '@/components/CandidatoPerfilModal.jsx';

const ESTADO_ORDER = [
  'recibido',
  'en_revision',
  'preseleccionado',
  'entrevista',
  'finalista',
  'contratado',
  'descartado'
];

const ESTADO_LABELS = {
  'recibido': 'Recibido',
  'en_revision': 'En revisión',
  'preseleccionado': 'Preseleccionado',
  'entrevista': 'Entrevista',
  'finalista': 'Finalista',
  'contratado': 'Contratado',
  'descartado': 'Descartado'
};

const GestionCandidatosPorEtapas = ({ empresaId, usuarioActualId, onDesbloquear, onChangeEstado }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [candidatos, setCandidatos] = useState([]);
  const [desbloqueos, setDesbloqueos] = useState(new Set());
  const [planPremium, setPlanPremium] = useState(false);

  const [selectedCandidato, setSelectedCandidato] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchKanbanData = async () => {
      setLoading(true);
      setError(null);
      try {
        const idToUse = empresaId || pb.authStore.model?.id;
        if (!idToUse) throw new Error('No autenticado');

        // Fetch ofertas of current admin
        const ofertas = await pb.collection('ofertas').getFullList({
          filter: `admin_id = "${idToUse}"`,
          $autoCancel: false
        });

        if (ofertas.length === 0) {
          setCandidatos([]);
          setLoading(false);
          return;
        }

        const ofertaIds = ofertas.map(o => o.id);

        const chunks = [];
        const chunkSize = 50;
        for (let i = 0; i < ofertaIds.length; i += chunkSize) {
          const chunk = ofertaIds.slice(i, i + chunkSize);
          const filterStr = chunk.map(id => `oferta_id="${id}"`).join(' || ');
          const chunkData = await pb.collection('candidatos').getFullList({
            filter: filterStr,
            expand: 'usuario_id,oferta_id',
            sort: '-created',
            $autoCancel: false
          });
          chunks.push(...chunkData);
        }

        setCandidatos(chunks);

        // Check unlocks
        const plan = await pb.collection('company_plans').getFirstListItem(`admin_id = "${idToUse}"`, { $autoCancel: false }).catch(() => null);
        if (plan && (plan.plan === 'premium' || plan.plan === 'empresa')) {
          setPlanPremium(true);
        } else {
          const unlocksData = await pb.collection('candidato_desbloqueos').getFullList({
            filter: `admin_id = "${idToUse}"`,
            $autoCancel: false
          });
          const unlockedSet = new Set(unlocksData.map(d => `${d.candidato_id}-${d.oferta_id}`));
          setDesbloqueos(unlockedSet);
        }

      } catch (err) {
        console.error('Error fetching kanban data:', err);
        setError('No se pudieron cargar los candidatos para la vista Kanban.');
      } finally {
        setLoading(false);
      }
    };

    fetchKanbanData();
  }, [empresaId]);

  // Use the passed onChangeEstado if available, else local one
  const handleLocalEstadoChange = async (candidatoId, nuevoEstado) => {
    if (onChangeEstado) {
      await onChangeEstado(candidatoId, nuevoEstado);
      setCandidatos(prev => prev.map(c => c.id === candidatoId ? { ...c, estado_candidatura: nuevoEstado } : c));
      if (selectedCandidato && selectedCandidato.id === candidatoId) {
        setSelectedCandidato(prev => ({ ...prev, estado_candidatura: nuevoEstado }));
      }
      return;
    }

    try {
      await pb.collection('candidatos').update(candidatoId, { estado_candidatura: nuevoEstado }, { $autoCancel: false });
      setCandidatos(prev => prev.map(c => c.id === candidatoId ? { ...c, estado_candidatura: nuevoEstado } : c));
      
      if (selectedCandidato && selectedCandidato.id === candidatoId) {
        setSelectedCandidato(prev => ({ ...prev, estado_candidatura: nuevoEstado }));
      }
      toast.success(`Estado actualizado a ${ESTADO_LABELS[nuevoEstado]}`);
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error('Error al actualizar el estado');
    }
  };

  const handleOpenPerfil = (candidato) => {
    setSelectedCandidato(candidato);
    setIsModalOpen(true);
  };

  const isUnlocked = (candidato) => {
    if (planPremium) return true;
    return desbloqueos.has(`${candidato.id}-${candidato.oferta_id}`);
  };

  // Callback to sync unlock state back from modal
  const handleDesbloquearWrapper = async (candidatoId, ofertaId) => {
    if (onDesbloquear) {
      await onDesbloquear(candidatoId, ofertaId);
      setDesbloqueos(prev => new Set([...prev, `${candidatoId}-${ofertaId}`]));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium">Cargando tablero...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <p className="font-medium">{error}</p>
        </div>
      </div>
    );
  }

  const grouped = ESTADO_ORDER.reduce((acc, estado) => {
    acc[estado] = candidatos.filter(c => c.estado_candidatura === estado);
    return acc;
  }, {});

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex overflow-x-auto gap-6 pb-6 pt-2 snap-x snap-mandatory hide-scrollbar" style={{ minHeight: '600px' }}>
        {ESTADO_ORDER.map((estado) => {
          const colCandidatos = grouped[estado];
          
          return (
            <div key={estado} className="snap-start shrink-0 w-[300px] flex flex-col bg-muted/30 rounded-2xl border border-border/50 overflow-hidden">
              <div className="p-4 border-b border-border/50 bg-muted/50 flex justify-between items-center">
                <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">{ESTADO_LABELS[estado]}</h3>
                <span className="bg-background text-foreground text-xs font-bold px-2.5 py-1 rounded-full border shadow-sm">
                  {colCandidatos.length}
                </span>
              </div>
              <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                {colCandidatos.map(candidato => (
                  <TarjetaCandidato 
                    key={candidato.id} 
                    candidato={candidato} 
                    onOpenPerfil={handleOpenPerfil}
                    hideContact={!isUnlocked(candidato)}
                  />
                ))}
                {colCandidatos.length === 0 && (
                  <div className="h-24 flex items-center justify-center border-2 border-dashed border-border/60 rounded-xl">
                    <span className="text-xs text-muted-foreground font-medium">Sin candidatos</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <CandidatoPerfilModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        candidato={selectedCandidato}
        empresaId={empresaId || pb.authStore.model?.id}
        usuarioActualId={usuarioActualId || pb.authStore.model?.id}
        onDesbloquear={handleDesbloquearWrapper}
        onChangeEstado={handleLocalEstadoChange}
      />
    </div>
  );
};

export default GestionCandidatosPorEtapas;