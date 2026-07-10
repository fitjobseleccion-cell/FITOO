import { useState, useCallback } from 'react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

export const useReviews = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReviews = useCallback(async (page = 1, perPage = 10, filters = '', sort = '-created') => {
    setLoading(true);
    try {
      const result = await pb.collection('reviews').getList(page, perPage, {
        filter: filters,
        sort: sort,
        expand: 'userId,serviceId,review_responses(reviewId)',
        $autoCancel: false
      });
      return result;
    } catch (err) {
      setError(err.message);
      toast.error('Error al cargar las reseñas');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createReview = async (data) => {
    setLoading(true);
    try {
      const record = await pb.collection('reviews').create(data, { $autoCancel: false });
      toast.success('Reseña enviada correctamente. Pendiente de moderación.');
      return record;
    } catch (err) {
      setError(err.message);
      toast.error('Error al enviar la reseña');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateReview = async (id, data) => {
    setLoading(true);
    try {
      const record = await pb.collection('reviews').update(id, data, { $autoCancel: false });
      toast.success('Reseña actualizada correctamente');
      return record;
    } catch (err) {
      setError(err.message);
      toast.error('Error al actualizar la reseña');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (id) => {
    setLoading(true);
    try {
      await pb.collection('reviews').delete(id, { $autoCancel: false });
      toast.success('Reseña eliminada');
      return true;
    } catch (err) {
      setError(err.message);
      toast.error('Error al eliminar la reseña');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addHelpful = async (reviewId, userId) => {
    try {
      await pb.collection('review_helpful').create({
        reviewId,
        userId
      }, { $autoCancel: false });
      
      // Increment counter
      const review = await pb.collection('reviews').getOne(reviewId, { $autoCancel: false });
      await pb.collection('reviews').update(reviewId, {
        helpful_count: (review.helpful_count || 0) + 1
      }, { $autoCancel: false });
      
      toast.success('Marcado como útil');
      return true;
    } catch (err) {
      if (err.status === 400) {
        toast.error('Ya has marcado esta reseña como útil');
      } else {
        toast.error('Error al procesar la solicitud');
      }
      return false;
    }
  };

  const reportReview = async (reviewId, userId, reason) => {
    setLoading(true);
    try {
      await pb.collection('review_reports').create({
        reviewId,
        userId,
        reason,
        status: 'pending'
      }, { $autoCancel: false });
      toast.success('Reseña reportada correctamente');
      return true;
    } catch (err) {
      if (err.status === 400) {
        toast.error('Ya has reportado esta reseña');
      } else {
        toast.error('Error al reportar la reseña');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getReviewStats = useCallback(async () => {
    try {
      const records = await pb.collection('reviews').getFullList({
        filter: 'status="approved"',
        $autoCancel: false
      });
      
      const total = records.length;
      if (total === 0) return { average: 0, total: 0, distribution: { 1:0, 2:0, 3:0, 4:0, 5:0 } };
      
      const distribution = { 1:0, 2:0, 3:0, 4:0, 5:0 };
      let sum = 0;
      
      records.forEach(r => {
        distribution[r.rating] = (distribution[r.rating] || 0) + 1;
        sum += r.rating;
      });
      
      return {
        average: (sum / total).toFixed(1),
        total,
        distribution
      };
    } catch (err) {
      console.error(err);
      return { average: 0, total: 0, distribution: { 1:0, 2:0, 3:0, 4:0, 5:0 } };
    }
  }, []);

  return {
    loading,
    error,
    fetchReviews,
    createReview,
    updateReview,
    deleteReview,
    addHelpful,
    reportReview,
    getReviewStats
  };
};