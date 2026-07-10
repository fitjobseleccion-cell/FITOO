import React from 'react';
import ReviewForm from '@/components/ReviewForm.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';

const ReviewFormPage = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-muted/30 pt-24 pb-16">
        <div className="container max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Escribe una Reseña</h1>
            <p className="text-muted-foreground">Tu opinión nos ayuda a mejorar y guía a otros usuarios.</p>
          </div>
          <ReviewForm />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ReviewFormPage;