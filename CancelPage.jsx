import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { XCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CancelPage() {
  return (
    <>
      <Helmet>
        <title>Pago Cancelado | FITJOB</title>
      </Helmet>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-24 bg-muted/20">
        <div className="max-w-md w-full bg-card rounded-2xl shadow-lg border p-8 text-center">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-destructive" />
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-3">Pago Cancelado</h1>
          
          <p className="text-muted-foreground mb-8">
            Has cancelado el proceso de pago. No se ha realizado ningún cargo en tu tarjeta. Puedes volver a intentarlo cuando estés listo.
          </p>
          
          <div className="flex flex-col gap-3">
            <Button asChild className="w-full h-12 text-base font-semibold">
              <Link to="/checkout-plan">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a los planes
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link to="/">
                Ir al inicio
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}