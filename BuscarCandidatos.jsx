import React, { useState, useEffect } from 'react';
import { Loader2, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import TarjetaCandidato from '@/components/TarjetaCandidato.jsx';
import CandidatoPerfilModal from '@/components/CandidatoPerfilModal.jsx';
import FiltrosCandidatos from '@/components/FiltrosCandidatos.jsx';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const BuscarCandidatos = ({ empresaId, usuarioActualId, onDesbloquear, onChangeEstado }) => {
  const [candidatos, setCandidatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingFilters, setLoadingFilters] = useState(true);
  
  const [filtrosDisponibles, setFiltrosDisponibles] = useState({});
  const [filtrosActivos, setFiltrosActivos] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const perPage = 12;

  // Unlocks & Plan
  const [planPremium, setPlanPremium] = useState(false);
  const [desbloqueos, setDesbloqueos] = useState(new Set());

  // Modal
  const [selectedCandidato, setSelectedCandidato] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); 
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const loadInitialData = async () => {
      if (!empresaId) return;
      try {
        const plan = await pb.collection('company_plans').getFirstListItem(`admin_id = "${empresaId}"`, { $autoCancel: false }).catch(() => null);
        if (plan && (plan.plan === 'premium' || plan.plan === 'empresa')) {
          setPlanPremium(true);
        } else {
          const unlocksData = await pb.collection('candidato_desbloqueos').getFullList({
            filter: `admin_id = "${empresaId}"`,
            $autoCancel: false
          });
          const unlockedSet = new Set(unlocksData.map(d => `${d.candidato_id}-${d.oferta_id}`));
          setDesbloqueos(unlockedSet);
        }

        const records = await pb.collection('candidatos').getFullList({
          fields: 'ciudad,provincia,permiso_trabajo,estado_candidatura',
          $autoCancel: false
        });

        const uniqueValues = {
          ciudad: new Set(),
          provincia: new Set(),
          permiso_trabajo: new Set(),
          estado_candidatura: new Set()
        };

        records.forEach(r => {
          if (r.ciudad) uniqueValues.ciudad.add(r.ciudad.toLowerCase());
          if (r.provincia) uniqueValues.provincia.add(r.provincia.toLowerCase());
          if (r.permiso_trabajo) uniqueValues.permiso_trabajo.add(r.permiso_trabajo.toLowerCase());
          if (r.estado_candidatura) uniqueValues.estado_candidatura.add(r.estado_candidatura.toLowerCase());
        });

        setFiltrosDisponibles({
          ciudad: Array.from(uniqueValues.ciudad).sort(),
          provincia: Array.from(uniqueValues.provincia).sort(),
          permiso_trabajo: Array.from(uniqueValues.permiso_trabajo).sort(),
          estado_candidatura: Array.from(uniqueValues.estado_candidatura).sort()
        });

      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setLoadingFilters(false);
      }
    };

    loadInitialData();
  }, [empresaId]);

  useEffect(() => {
    const fetchCandidatos = async () => {
      setLoading(true);
      try {
        let filterParts = [];
        
        if (debouncedSearch) {
          filterParts.push(`(nombre ~ "${debouncedSearch}" || apellidos ~ "${debouncedSearch}")`);
        }
        
        Object.entries(filtrosActivos).forEach(([key, value]) => {
          if (value) {
            filterParts.push(`${key} ~ "${value}"`);
          }
        });

        const filterString = filterParts.join(' && ');

        const result = await pb.collection('candidatos').getList(page, perPage, {
          filter: filterString,
          expand: 'usuario_id,oferta_id',
          sort: '-created',
          $autoCancel: false
        });

        setCandidatos(result.items);
        setTotalPages(result.totalPages);
        setTotalItems(result.totalItems);
      } catch (error) {
        console.error("Error loading candidates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidatos();
  }, [debouncedSearch, filtrosActivos, page]);

  const handleFiltroChange = (key, value) => {
    setFiltrosActivos(prev => {
      const updated = { ...prev };
      if (!value) delete updated[key];
      else updated[key] = value;
      return updated;
    });
    setPage(1);
  };

  const handleLimpiarFiltros = () => {
    setFiltrosActivos({});
    setSearchQuery('');
    setPage(1);
  };

  const isUnlocked = (candidato) => {
    if (planPremium) return true;
    return desbloqueos.has(`${candidato.id}-${candidato.oferta_id}`);
  };

  const handleOpenPerfil = (candidato) => {
    setSelectedCandidato(candidato);
    setIsModalOpen(true);
  };

  const handleDesbloquearWrapper = async (candidatoId, ofertaId) => {
    if (onDesbloquear) {
      await onDesbloquear(candidatoId, ofertaId);
      setDesbloqueos(prev => new Set([...prev, `${candidatoId}-${ofertaId}`]));
    }
  };

  const handleChangeEstadoWrapper = async (candidatoId, nuevoEstado) => {
    if (onChangeEstado) {
      await onChangeEstado(candidatoId, nuevoEstado);
      setCandidatos(prev => prev.map(c => c.id === candidatoId ? { ...c, estado_candidatura: nuevoEstado } : c));
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <div className="w-full lg:w-1/4 shrink-0">
        {loadingFilters ? (
          <Skeleton className="h-[400px] w-full rounded-xl" />
        ) : (
          <FiltrosCandidatos 
            filtrosDisponibles={filtrosDisponibles}
            filtrosActivos={filtrosActivos}
            onFiltroChange={handleFiltroChange}
            onLimpiarFiltros={handleLimpiarFiltros}
            searchQuery={searchQuery}
            onBusquedaChange={setSearchQuery}
            totalCandidatos={totalItems}
          />
        )}
      </div>

      <div className="flex-1 w-full min-w-0">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-xl" />
            ))}
          </div>
        ) : candidatos.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {candidatos.map((candidato) => (
                <TarjetaCandidato 
                  key={candidato.id} 
                  candidato={candidato} 
                  onOpenPerfil={handleOpenPerfil}
                  hideContact={!isUnlocked(candidato)}
                />
              ))}
            </div>

            {totalItems > perPage && (
              <div className="flex items-center justify-between mt-10 bg-card p-4 rounded-xl border border-border shadow-sm">
                <Button 
                  variant="outline" 
                  disabled={page === 1} 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Anterior
                </Button>
                <span className="text-sm font-medium text-muted-foreground">
                  Página <span className="text-foreground">{page}</span> de {totalPages}
                </span>
                <Button 
                  variant="outline" 
                  disabled={page === totalPages || totalPages === 0} 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className="flex items-center gap-1"
                >
                  Siguiente <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24 bg-card border border-dashed border-border rounded-3xl flex flex-col items-center justify-center">
            <div className="bg-muted/50 p-4 rounded-full mb-4">
              <Users className="w-10 h-10 text-muted-foreground/60" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No se encontraron candidatos</h3>
            <p className="text-muted-foreground max-w-sm mb-6 text-sm">
              Intenta ajustar los filtros o el término de búsqueda para ver más resultados.
            </p>
            {(searchQuery || Object.keys(filtrosActivos).length > 0) && (
              <Button onClick={handleLimpiarFiltros} variant="secondary">
                Limpiar filtros
              </Button>
            )}
          </div>
        )}
      </div>

      <CandidatoPerfilModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        candidato={selectedCandidato}
        empresaId={empresaId}
        usuarioActualId={usuarioActualId}
        onDesbloquear={handleDesbloquearWrapper}
        onChangeEstado={handleChangeEstadoWrapper}
      />
    </div>
  );
};

export default BuscarCandidatos;