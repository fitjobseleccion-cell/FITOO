import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const FitoRating = ({ sessionId, onClose }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRating = async (isHelpful) => {
    setIsSubmitting(true);
    try {
      const data = {
        util: isHelpful,
        sesion_id: sessionId,
      };
      
      if (user) {
        data.usuario_id = user.id;
      }

      await pb.collection('valoraciones_fito').create(data, { $autoCancel: false });
      toast.success('Gracias por tu feedback');
      onClose();
    } catch (error) {
      console.error('Error saving rating:', error);
      // Fallback for permissions error if anonymous
      toast.success('Gracias por tu feedback');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-muted/50 border-t border-border mt-auto">
      <p className="text-sm font-medium text-foreground text-center mb-3">¿Te ha sido útil FITO?</p>
      <div className="flex justify-center gap-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-colors"
          onClick={() => handleRating(true)}
          disabled={isSubmitting}
        >
          <ThumbsUp className="w-4 h-4 mr-2" />
          Sí
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
          onClick={() => handleRating(false)}
          disabled={isSubmitting}
        >
          <ThumbsDown className="w-4 h-4 mr-2" />
          No
        </Button>
      </div>
    </div>
  );
};

export default FitoRating;