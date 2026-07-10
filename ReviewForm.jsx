import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useReviews } from '@/hooks/useReviews.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const ReviewForm = ({ initialData = null }) => {
  const { currentUser } = useAuth();
  const { createReview, updateReview, loading } = useReviews();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    rating: initialData?.rating || 0,
    title: initialData?.title || '',
    comment: initialData?.comment || '',
    photos: null
  });
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && currentUser && initialData.userId !== currentUser.id) {
      toast.error('No tienes permiso para editar esta reseña.');
      navigate('/reviews');
    }
  }, [initialData, currentUser, navigate]);

  if (!currentUser) {
    return (
      <div className="text-center p-12 bg-card rounded-2xl shadow-sm border border-border">
        <h3 className="text-2xl font-bold mb-4 text-foreground">Inicia sesión para publicar tu reseña</h3>
        <p className="text-muted-foreground mb-8">Debes iniciar sesión para publicar reseñas auténticas y ayudarnos a prevenir el spam.</p>
        <Button size="lg" onClick={() => navigate('/login')}>
          Iniciar sesión
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser.tipo_cuenta) {
      toast.error('Por favor, completa tu perfil antes de publicar una reseña.');
      return;
    }

    if (formData.rating < 1 || formData.rating > 5) {
      toast.error('La puntuación debe ser entre 1 y 5 estrellas');
      return;
    }
    if (formData.comment.length < 10 || formData.comment.length > 500) {
      toast.error('El comentario debe tener entre 10 y 500 caracteres');
      return;
    }
    if (formData.title && formData.title.length > 100) {
      toast.error('El título no puede exceder los 100 caracteres');
      return;
    }
    if (formData.photos && formData.photos.length > 5) {
      toast.error('Puedes subir un máximo de 5 fotos');
      return;
    }

    setIsSubmitting(true);

    try {
      if (!initialData) {
        const existing = await pb.collection('reviews').getList(1, 1, {
          filter: `userId="${currentUser.id}"`,
          $autoCancel: false
        });

        if (existing.items.length > 0) {
          toast.error('Ya has dejado una reseña');
          setIsSubmitting(false);
          return;
        }
      }

      const data = new FormData();
      data.append('userId', currentUser.id);
      data.append('userName', currentUser.name || '');
      data.append('userEmail', currentUser.email || '');
      
      data.append('rating', formData.rating);
      data.append('title', formData.title);
      data.append('comment', formData.comment);
      
      if (!initialData) {
        // SCENARIO B: Auto-publish without moderation
        data.append('status', 'approved');
        data.append('verified', 'true');
        data.append('edited_within_24h', 'false');
      }

      if (formData.photos) {
        for (let i = 0; i < Math.min(formData.photos.length, 5); i++) {
          data.append('photos', formData.photos[i]);
        }
      }

      if (initialData) {
        await updateReview(initialData.id, data);
        toast.success('Reseña actualizada correctamente');
      } else {
        await createReview(data);
        toast.success('¡Reseña publicada con éxito!');
      }
      
      navigate('/reviews');
    } catch (err) {
      console.error(err);
      toast.error('Error al procesar la reseña. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border">
      <div className="space-y-2">
        <label className="text-sm font-medium">Puntuación *</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setFormData({...formData, rating: star})}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= (hoveredStar || formData.rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-muted text-muted'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Título (Opcional)</label>
        <Input
          placeholder="Resume tu experiencia"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          maxLength={100}
        />
        <p className="text-xs text-muted-foreground text-right">
          {formData.title.length}/100
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Comentario *</label>
        <Textarea
          placeholder="Cuéntanos más sobre tu experiencia (mínimo 10 caracteres)..."
          className="min-h-[150px]"
          value={formData.comment}
          onChange={(e) => setFormData({...formData, comment: e.target.value})}
          minLength={10}
          maxLength={500}
          required
        />
        <p className="text-xs text-muted-foreground text-right">
          {formData.comment.length}/500
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Fotos (Opcional, máx 5)</label>
        <Input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setFormData({...formData, photos: e.target.files})}
          className="cursor-pointer"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting || loading}>
        {isSubmitting || loading ? 'Procesando...' : (initialData ? 'Actualizar Reseña' : 'Publicar Reseña')}
      </Button>
    </form>
  );
};

export default ReviewForm;