import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useReviews } from '@/hooks/useReviews.js';

const ReviewEditModal = ({ isOpen, onClose, review, onUpdate }) => {
  const [title, setTitle] = useState(review?.title || '');
  const [comment, setComment] = useState(review?.comment || '');
  const { updateReview, loading } = useReviews();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateReview(review.id, {
        title,
        comment,
        status: 'pending',
        edited_within_24h: true
      });
      onUpdate();
      onClose();
    } catch (err) {
      // Error handled in hook
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Reseña</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Título (Opcional)</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Resume tu experiencia"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Comentario</label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Cuéntanos más sobre tu experiencia..."
                className="min-h-[120px]"
                required
                minLength={10}
                maxLength={500}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewEditModal;