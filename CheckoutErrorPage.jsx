import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { XCircle, ArrowLeft, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const CheckoutErrorPage = () => {
  return (
    <>
      <Helmet>
        <title>Error en el Pago | FITJOB</title>
      </Helmet>
      
      <div className="pt-24 min-h-[85vh] bg-muted/30 pb-20 flex items-center">
        <div className="container max-w-2xl">
          <Card className="border-border/50 shadow-lg overflow-hidden">
            <div className="bg-destructive/10 p-8 text-center border-b border-destructive/20">
              <div className="w-20 h-20 bg-destructive text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <XCircle className="w-10 h-10" />
              </div>
              <h1 className="text-3xl font-bold mb-4 text-foreground">Pago no completado</h1>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                Ha ocurrido un problema al procesar tu pago o la operación ha sido cancelada. No se ha realizado ningún cargo en tu tarjeta.
              </p>
            </div>

            <CardContent className="p-8 text-center">
              <div className="mb-8">
                <h3 className="font-semibold text-foreground mb-4">¿Necesitas ayuda?</h3>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    <a href="mailto:fitjob.seleccion@gmail.com" className="hover:text-primary transition-colors">fitjob.seleccion@gmail.com</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-primary" />
                    <a href="tel:+34919519018" className="hover:text-primary transition-colors">919 519 018</a>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/checkout" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full rounded-full px-8">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Reintentar Pago
                  </Button>
                </Link>
                <Link to="/" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full rounded-full px-8">
                    Volver al inicio
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default CheckoutErrorPage;