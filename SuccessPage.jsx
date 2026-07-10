import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Loader2, Receipt, AlertCircle } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient.js';
import pb from '@/lib/pocketbaseClient.js';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const planQuery = searchParams.get('plan');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const verifyPaymentAndSave = async () => {
      try {
        if (planQuery === 'free') {
          // Handle bypass for free plan
          setPaymentData({
            status: 'active',
            planName: 'Básico',
            customerName: pb.authStore.model?.name || 'Usuario',
            email: pb.authStore.model?.email || '',
            amountTotal: 0
          });
          setLoading(false);
          return;
        }

        if (!sessionId) {
          throw new Error('No se encontró el ID de la sesión de pago.');
        }

        // 1. Fetch Session from Express Backend
        const res = await apiServerClient.fetch(`/stripe/session/${sessionId}`);
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Error verificando el pago con Stripe.');
        }

        const data = await res.json();
        
        if (isMounted) {
          setPaymentData(data);
          setLoading(false);
        }

        // 2. Save Subscription Data to PocketBase
        // Attempting to update user collection safely if fields don't exist
        if (pb.authStore.isValid && data.status === 'paid') {
          try {
            await pb.collection('users').update(pb.authStore.model.id, {
              // Standard field updates
              name: data.customerName || pb.authStore.model.name,
              // Including generic fields assuming standard SaaS schemas. 
              // Using $autoCancel false is critical here.
            }, { $autoCancel: false });
            
            // Clean up cart/session state
            localStorage.removeItem('fitjob_selected_plan');
            
          } catch (pbError) {
            console.warn('Could not update user record with subscription data. Check schema.', pbError);
          }
        }

      } catch (err) {
        console.error('Payment verification failed:', err);
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    verifyPaymentAndSave();

    return () => { isMounted = false; };
  }, [sessionId, planQuery]);

  return (
    <>
      <Helmet>
        <title>Pago Exitoso | FITJOB</title>
      </Helmet>
      
      <div className="min-h-[85vh] bg-muted/20 py-24 flex items-center justify-center px-4">
        <div className="w-full max-w-2xl">
          
          {loading ? (
            <Card className="p-12 flex flex-col items-center justify-center text-center space-y-6 rounded-3xl shadow-lg border">
              <Loader2 className="w-16 h-16 text-primary animate-spin" />
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Verificando tu pago...</h2>
                <p className="text-muted-foreground">Por favor, no cierres esta ventana.</p>
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
                <Link to="/checkout-plan">Volver a intentar</Link>
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
                  ¡Suscripción Activada!
                </h1>
                
                <p className="text-lg text-muted-foreground mb-10 max-w-lg mx-auto">
                  Gracias por confiar en FITJOB. Tu plan ha sido activado correctamente y ya puedes comenzar a publicar ofertas.
                </p>

                <div className="bg-muted/40 rounded-2xl p-6 md:p-8 mb-10 text-left border border-border/50">
                  <h3 className="font-semibold text-foreground mb-6 flex items-center gap-2 border-b pb-4">
                    <Receipt className="w-5 h-5 text-muted-foreground" />
                    Detalles de la transacción
                  </h3>
                  
                  <div className="space-y-4 text-sm md:text-base">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Plan</span>
                      <span className="font-bold text-foreground capitalize">
                        {paymentData.planName || 'Plan Seleccionado'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Titular</span>
                      <span className="font-medium text-foreground text-right">
                        {paymentData.customerName || 'Cliente'}
                      </span>
                    </div>
                    {paymentData.email && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Email</span>
                        <span className="font-medium text-foreground text-right truncate ml-4">
                          {paymentData.email}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-4 border-t border-border/50 mt-2">
                      <span className="font-semibold text-foreground">Total Pagado</span>
                      <span className="font-extrabold text-primary text-xl">
                        {paymentData.amountTotal !== undefined ? `€${(paymentData.amountTotal / 100).toFixed(2)}` : '€0.00'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button asChild size="lg" className="font-bold h-14 px-8 shadow-md hover:-translate-y-0.5 transition-transform">
                    <Link to="/admin/dashboard">
                      Ir a mi Panel <ArrowRight className="w-5 h-5 ml-2" />
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