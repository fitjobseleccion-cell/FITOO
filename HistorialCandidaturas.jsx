import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, ExternalLink, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const ESTADOS = [
  { value: 'recibido', label: 'Recibido' },
  { value: 'en_revision', label: 'En revisión' },
  { value: 'preseleccionado', label: 'Preseleccionado' },
  { value: 'entrevista', label: 'Entrevista' },
  { value: 'finalista', label: 'Finalista' },
  { value: 'contratado', label: 'Contratado' },
  { value: 'descartado', label: 'Descartado' }
];

const HistorialCandidaturas = ({ candidatoId, empresaId, usuarioId, onChangeEstado }) => {
  const [candidaturas, setCandidaturas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistorial = useCallback(async () => {
    if (!usuarioId || !empresaId) {
      setLoading(false);
      return;
    }
    
    try {
      // Fetch other applications by this user to this company's offers
      const records = await pb.collection('candidatos').getFullList({
        filter: `usuario_id = "${usuarioId}" && oferta_id.admin_id = "${empresaId}"`,
        expand: 'oferta_id',
        sort: '-created',
        $autoCancel: false
      });
      setCandidaturas(records);
    } catch (error) {
      console.error('Error fetching historial:', error);
    } finally {
      setLoading(false);
    }
  }, [usuarioId, empresaId]);

  useEffect(() => {
    fetchHistorial();
  }, [fetchHistorial]);

  const handleStatusChange = (id, nuevoEstado) => {
    if (onChangeEstado) {
      onChangeEstado(id, nuevoEstado);
      // Optimistic update locally
      setCandidaturas(prev => prev.map(c => c.id === id ? { ...c, estado_candidatura: nuevoEstado } : c));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
        <History className="w-4 h-4 text-muted-foreground" />
        Historial con tu empresa
      </h3>

      {candidaturas.length > 0 ? (
        <div className="space-y-3">
          {candidaturas.map((cand) => {
            const isCurrent = cand.id === candidatoId;
            return (
              <div key={cand.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border ${isCurrent ? 'bg-primary/5 border-primary/20' : 'bg-card border-border/50'} gap-4`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-sm text-foreground truncate">
                      {cand.expand?.oferta_id?.titulo || 'Oferta eliminada'}
                    </h4>
                    {isCurrent && (
                      <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">Actual</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Inscrito el {new Date(cand.created).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Select 
                    value={cand.estado_candidatura} 
                    onValueChange={(val) => handleStatusChange(cand.id, val)}
                  >
                    <SelectTrigger className="w-[140px] h-8 text-xs bg-background shadow-sm">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {ESTADOS.map(estado => (
                        <SelectItem key={estado.value} value={estado.value} className="text-xs">
                          {estado.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {cand.oferta_id && (
                    <Button variant="outline" size="sm" className="h-8 px-2" asChild>
                      <Link to={`/ofertas-de-trabajo/${cand.oferta_id}`} target="_blank">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-muted/30 border border-dashed rounded-xl p-6 text-center">
          <p className="text-sm text-muted-foreground font-medium">No hay historial de candidaturas previas.</p>
        </div>
      )}
    </div>
  );
};

export default HistorialCandidaturas;