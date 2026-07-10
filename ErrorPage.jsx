import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { XCircle, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Breadcrumbs from '@/components/Breadcrumbs.jsx';

const ErrorPage = () => {
  const [searchParams] = useSearchParams();
  const errorMessage = searchParams.get('message') || 'Ha ocurrido un error inesperado durante el proceso de pago.';

  return (
    <>
      <Helmet>
        <title>Error en el Pago - FITJOB</title>
      </Helmet>
      
      <div className="pt-24 min-h-[80vh] bg-muted/30 pb-20">
        <Breadcrumbs />
        
        <div className="container max-w-lg mt-4">
          <div className="bg-card p-8 md:p-12 rounded-2xl shadow-lg border border-border text-center">
            <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10" />
            </div>
            
            <h1 className="text-3xl font-bold mb-4 text-foreground">Pago fallido</h1>
            
            <p className="text-lg text-muted-foreground mb-8">
              {errorMessage}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/checkout" className="w-full sm:w-auto">
                <Button size="lg" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Intentar de nuevo
                </Button>
              </Link>
              <Link to="/" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full">
                  <Home className="w-4 h-4 mr-2" /> Volver al inicio
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ErrorPage;