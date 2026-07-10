import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, FileText, ArrowRight, Loader2, AlertCircle, Briefcase } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient.js';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [solicitudData, setSolicitudData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const storedData = localStorage.getItem('fitjobSolicitudData');
    if (storedData) {
      try {
        setSolicitudData(JSON.parse(storedData));
      } catch (e) {
        console.error('Error parsing local storage solicitud data');
      }
    }

    if (!sessionId) {
      setError('No se proporcionó un identificador de sesión.');
      setLoading(false);
      return;
    }

    apiServerClient.fetch(`/stripe/session/${sessionId}`)
      .then(res => {
        if (!res.ok) throw new Error('Error al verificar el estado de la sesión de pago.');
        return res.json();
      })
      .then(data => {
        if (isMounted) {
          setPaymentData(data);
          setLoading(false);
          // Optional: clear local storage if payment is successful
          if (data.status === 'paid' || data.status === 'complete') {
            localStorage.removeItem('fitjobSolicitudData');
            localStorage.removeItem('fitjobSolicitudId');
            localStorage.removeItem('fitjobEmail');
          }
        }
      })
      .catch(err => {
        console.error('Error fetching session details:', err);
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, [sessionId]);

  return (
    <>
      <Helmet>
        <title>Pago Completado | FITJOB</title>
      </Helmet>
      
      <div className="min-h-[85vh] bg-muted/20 py-24 flex items-center justify-center px-4">
        <div className="w-full max-w-2xl">
          
          {loading ? (
            <Card className="p-12 flex flex-col items-center justify-center text-center space-y-6 rounded-3xl shadow-lg border">
              <Loader2 className="w-16 h-16 text-primary animate-spin" />
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Verificando tu pago...</h2>
                <p className="text-muted-foreground">Conectando con la pasarela de pagos segura.</p>
              </div>
            </Card>
          ) : error ? (
            <Card className="p-10 flex flex-col items-center justify-center text-center space-y-6 rounded-3xl shadow-lg border-destructive/20 bg-destructive/5">
              <AlertCircle className="w-16 h-16 text-destructive" />
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-destructive">Hubo un problema</h2>
                <p className="text-muted-foreground">{error}</p>
              </div>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/checkout">Volver a intentar</Link>
              </Button>
            </Card>
          ) : paymentData ? (
            <Card className="overflow-hidden rounded-3xl shadow-xl border relative">
              <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-primary to-green-400"></div>
              
              <div className="p-10 md:p-14 text-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-in zoom-in duration-500">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
                
                <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
                  ¡Contratación Confirmada!
                </h1>
                
                <p className="text-lg text-muted-foreground mb-10 max-w-lg mx-auto">
                  Hemos procesado tu pago con éxito. Nuestro equipo se pondrá a trabajar en tu vacante de inmediato.
                </p>

                <div className="bg-card shadow-sm rounded-2xl p-6 md:p-8 mb-8 text-left border border-border">
                  <h3 className="font-semibold text-foreground mb-6 flex items-center gap-2 border-b pb-4">
                    <FileText className="w-5 h-5 text-primary" />
                    Resumen de Operación
                  </h3>
                  
                  <div className="space-y-4 text-sm md:text-base">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Plan Seleccionado</span>
                      <span className="font-bold text-foreground capitalize">
                        {paymentData.planName || 'Plan'}
                      </span>
                    </div>

                    {solicitudData?.oferta_titulo && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Puesto</span>
                        <span className="font-medium text-foreground text-right flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-muted-foreground/60" />
                          {solicitudData.oferta_titulo}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Email de Contacto</span>
                      <span className="font-medium text-foreground text-right truncate ml-4">
                        {paymentData.email || solicitudData?.empresa_email || '-'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-border mt-2">
                      <span className="font-semibold text-foreground">Importe Abonado</span>
                      <span className="font-extrabold text-primary text-xl">
                        {paymentData.amount ? `€${(paymentData.amount / 100).toFixed(2)}` : '-'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <p className="text-sm text-muted-foreground">
                    En breve recibirás un correo con la factura e instrucciones sobre los próximos pasos.
                  </p>
                  <Button asChild size="lg" className="font-bold h-14 px-8 shadow-md hover:-translate-y-0.5 transition-transform w-full sm:w-auto">
                    <Link to="/">
                      Volver a la portada <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ) : null}
          
        </div>
      </div>
    </>
  );
}