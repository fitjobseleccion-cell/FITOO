import React, { useState } from 'react';
import { ThumbsUp, Flag, Edit2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import ReportReviewModal from './ReportReviewModal.jsx';
import ReviewEditModal from './ReviewEditModal.jsx';
import { useReviews } from '@/hooks/useReviews.js';
import { abreviarNombreCandidato } from '@/lib/formatters.js';

const ReviewCard = ({ review, onUpdate }) => {
  const { user } = useAuth();
  const { addHelpful } = useReviews();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const author = review.expand?.userId;
  const service = review.expand?.serviceId;
  const responses = review.expand?.['review_responses(reviewId)'] || [];
  const officialResponse = responses[0];

  const isOwner = user?.id === author?.id;
  const createdDate = new Date(review.created);
  const isWithin24h = (new Date() - createdDate) < 24 * 60 * 60 * 1000;

  const isEmpresa = author?.tipo_cuenta === 'empresa';
  const userTypeLabel = isEmpresa ? 'Empresa' : 'Candidato';

  const getDisplayName = () => {
    const name = author?.name || review.userName || 'Usuario Anónimo';
    if (isEmpresa) {
      return name;
    } else {
      const parts = name.trim().split(' ');
      if (parts.length > 1) {
        return abreviarNombreCandidato(parts[0], parts.slice(1).join(' '));
      }
      return name;
    }
  };

  const formattedDate = createdDate.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const handleHelpful = async () => {
    if (!user) return;
    const success = await addHelpful(review.id, user.id);
    if (success && onUpdate) onUpdate();
  };

  return (
    <div className="bg-card text-card-foreground rounded-2xl p-6 shadow-sm border border-border/50 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={author?.avatar ? pb.files.getURL(author, author.avatar) : ''} />
            <AvatarFallback>{author?.name?.charAt(0) || review.userName?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-foreground">{getDisplayName()}</h4>
              {author?.verificado && (
                isEmpresa ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200 text-xs font-medium border-0">
                    🟢 Empresa verificada
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200 text-xs font-medium border-0">
                    🔵 Candidato verificado
                  </Badge>
                )
              )}
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="font-medium text-foreground/80">{userTypeLabel}</span>
              <span>•</span>
              <span>{formattedDate} {review.edited_within_24h && '(editado)'}</span>
            </p>
          </div>
        </div>
        
        {isOwner && isWithin24h && (
          <Button variant="ghost" size="sm" onClick={() => setIsEditModalOpen(true)}>
            <Edit2 className="w-4 h-4 mr-2" />
            Editar
          </Button>
        )}
      </div>

      <div>
        <div className="text-amber-400 text-xl tracking-widest mb-3">
          {'⭐'.repeat(review.rating)}
        </div>
        
        {review.title && <h5 className="font-semibold text-lg mb-2 text-foreground">{review.title}</h5>}
        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{review.comment}</p>
      </div>

      {review.photos && review.photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-2">
          {review.photos.slice(0, 5).map((photo, idx) => (
            <div key={idx} className="aspect-square relative rounded-lg overflow-hidden border border-border">
              <img
                src={pb.files.getURL(review, photo)}
                alt={`Foto adjunta ${idx + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {service && (
        <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded-md inline-block w-fit mt-2">
          Servicio: <span className="font-medium text-foreground">{service.titulo}</span>
        </div>
      )}

      {officialResponse && (
        <div className="mt-4 bg-secondary/30 border-l-4 border-primary p-4 rounded-r-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-sm text-foreground">Respuesta de FITJOB</span>
          </div>
          <p className="text-sm text-foreground/80 whitespace-pre-wrap">{officialResponse.response_text}</p>
        </div>
      )}

      <div className="flex items-center gap-4 mt-2 pt-4 border-t border-border/50">
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={handleHelpful}>
          <ThumbsUp className="w-4 h-4 mr-2" />
          Útil ({review.helpful_count || 0})
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive ml-auto" onClick={() => setIsReportModalOpen(true)}>
          <Flag className="w-4 h-4 mr-2" />
          Reportar
        </Button>
      </div>

      <ReportReviewModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} reviewId={review.id} />
      {isOwner && <ReviewEditModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} review={review} onUpdate={onUpdate} />}
    </div>
  );
};

export default ReviewCard;