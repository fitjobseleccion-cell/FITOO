import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useReviews } from '@/hooks/useReviews.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const ReportReviewModal = ({ isOpen, onClose, reviewId }) => {
  const [reason, setReason] = useState('');
  const { reportReview, loading } = useReviews();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Debes iniciar sesión para reportar');
      return;
    }
    if (reason.trim().length < 10) {
      toast.error('El motivo debe tener al menos 10 caracteres');
      return;
    }
    
    const success = await reportReview(reviewId, user.id, reason);
    if (success) {
      setReason('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reportar Reseña</DialogTitle>
          <DialogDescription>
            ¿Por qué consideras que esta reseña es inapropiada? Nuestro equipo la revisará.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <Textarea
              placeholder="Explica el motivo de tu reporte..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar Reporte'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportReviewModal;