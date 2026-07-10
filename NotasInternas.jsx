import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, StickyNote, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';
import { Button } from '@/components/ui/button';
import ModalNota from '@/components/ModalNota.jsx';

const NotasInternas = ({ candidatoId, empresaId, usuarioActualId }) => {
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notaEnEdicion, setNotaEnEdicion] = useState(null);

  const fetchNotas = useCallback(async () => {
    if (!candidatoId || !empresaId) return;
    setLoading(true);
    try {
      const records = await pb.collection('notas_candidatos').getFullList({
        filter: `candidato_id = "${candidatoId}" && empresa_id = "${empresaId}"`,
        expand: 'usuario_id',
        sort: '-created',
        $autoCancel: false
      });
      setNotas(records);
    } catch (error) {
      console.error('Error fetching notas:', error);
      toast.error('No se pudieron cargar las notas internas.');
    } finally {
      setLoading(false);
    }
  }, [candidatoId, empresaId]);

  useEffect(() => {
    fetchNotas();
  }, [fetchNotas]);

  const handleCrearNota = async (texto) => {
    try {
      await pb.collection('notas_candidatos').create({
        empresa_id: empresaId,
        candidato_id: candidatoId,
        usuario_id: usuarioActualId,
        texto: texto
      }, { $autoCancel: false });
      toast.success('Nota añadida correctamente');
      fetchNotas();
    } catch (error) {
      console.error('Error creating nota:', error);
      toast.error('Error al guardar la nota');
    }
  };

  const handleEditarNota = async (texto) => {
    if (!notaEnEdicion) return;
    try {
      await pb.collection('notas_candidatos').update(notaEnEdicion.id, {
        texto: texto
      }, { $autoCancel: false });
      toast.success('Nota actualizada');
      fetchNotas();
    } catch (error) {
      console.error('Error updating nota:', error);
      toast.error('Error al actualizar la nota');
    }
  };

  const handleEliminarNota = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta nota?')) return;
    try {
      await pb.collection('notas_candidatos').delete(id, { $autoCancel: false });
      toast.success('Nota eliminada');
      fetchNotas();
    } catch (error) {
      console.error('Error deleting nota:', error);
      toast.error('Error al eliminar la nota');
    }
  };

  const openCreateModal = () => {
    setNotaEnEdicion(null);
    setIsModalOpen(true);
  };

  const openEditModal = (nota) => {
    setNotaEnEdicion(nota);
    setIsModalOpen(true);
  };

  const handleSaveNota = (texto) => {
    if (notaEnEdicion) {
      handleEditarNota(texto);
    } else {
      handleCrearNota(texto);
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
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Notas Internas</h3>
        <Button onClick={openCreateModal} size="sm" variant="outline" className="gap-1">
          <Plus className="w-4 h-4" /> Añadir nota
        </Button>
      </div>

      {notas.length > 0 ? (
        <div className="space-y-3">
          {notas.map((nota) => {
            const isOwner = nota.usuario_id === usuarioActualId;
            const authorName = nota.expand?.usuario_id?.name || 'Usuario eliminado';
            
            return (
              <div key={nota.id} className="bg-yellow-50/50 dark:bg-yellow-900/10 border border-yellow-200/50 dark:border-yellow-700/30 rounded-xl p-4 shadow-sm">
                <p className="text-sm text-foreground whitespace-pre-wrap mb-3 leading-relaxed">{nota.texto}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    Añadida por <span className="font-medium">{authorName}</span> el {new Date(nota.created).toLocaleDateString()}
                  </span>
                  {isOwner && (
                    <div className="flex gap-2">
                      <button onClick={() => openEditModal(nota)} className="hover:text-primary transition-colors flex items-center gap-1">
                        <Edit2 className="w-3 h-3" /> Editar
                      </button>
                      <button onClick={() => handleEliminarNota(nota.id)} className="hover:text-destructive transition-colors flex items-center gap-1">
                        <Trash2 className="w-3 h-3" /> Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-muted/30 border border-dashed rounded-xl p-8 text-center flex flex-col items-center">
          <StickyNote className="w-8 h-8 text-muted-foreground/50 mb-3" />
          <p className="text-sm text-muted-foreground font-medium mb-1">No hay notas para este candidato</p>
          <p className="text-xs text-muted-foreground mb-4">Añade notas visibles solo para tu equipo</p>
          <Button onClick={openCreateModal} size="sm" variant="secondary">Crear primera nota</Button>
        </div>
      )}

      <ModalNota 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        nota={notaEnEdicion}
        onSave={handleSaveNota}
      />
    </div>
  );
};

export default NotasInternas;