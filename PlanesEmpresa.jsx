import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Check, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';
import apiServerClient from '@/lib/apiServerClient.js';
import { PLAN_CONFIG, getDaysUntilExpiration, shouldNotifyExpiration } from '@/lib/planUtils.js';

const PlanesEmpresa = () => {
  const navigate = useNavigate();
  const [currentPlan, setCurrentPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(null);

  useEffect(() => {
    const fetchCurrentPlan = async () => {
      try {
        if (!pb.authStore.isValid) {
          navigate('/login');
          return;
        }
        
        const user = pb.authStore.model;
        const plan = await pb.collection('company_plans').getFirstListItem(`admin_id = "${user.id}"`, { $autoCancel: false });
        setCurrentPlan(plan);
      } catch (err) {
        console.error('Error fetching plan:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentPlan();
  }, [navigate]);

  const handleSubscribe = async (planId) => {
    if (planId === 'gratis' || planId === currentPlan?.plan) return;
    
    setIsProcessing(planId);
    try {
      const user = pb.authStore.model;
      
      const response = await apiServerClient.fetch('/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: `plan-${planId}`,
          userId: user.id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear la sesión de pago');
      }

      const data = await response.json();
      if (data.url) {
        window.open(data.url, '_blank');
      } else {
        throw new Error('No se recibió la URL de pago');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error(err.message || 'No se pudo procesar la solicitud. Inténtalo de nuevo.');
    } finally {
      setIsProcessing(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50/50 dark:bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Cargando planes...</p>
      </div>
    );
  }

  const expirationWarning = currentPlan?.plan_valido_hasta && shouldNotifyExpiration(currentPlan.plan_valido_hasta);
  const daysLeft = expirationWarning ? getDaysUntilExpiration(currentPlan.plan_valido_hasta) : null;

  return (
    <>
      <Helmet>
        <title>Planes para Empresas | FITJOB</title>
        <meta name="description" content="Descubre nuestros planes para empresas y encuentra el talento ideal para tu negocio." />
      </Helmet>

      <div className="min-h-screen bg-slate-50/50 dark:bg-background py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4" style={{ letterSpacing: '-0.02em' }}>
              Impulsa tu selección de personal
            </h1>
            <p className="text-lg text-muted-foreground">
              Elige el plan que mejor se adapte a las necesidades de contratación de tu empresa. Sin compromisos a largo plazo.
            </p>
          </div>

          {expirationWarning && (
            <div className="max-w-3xl mx-auto mb-12 bg-destructive/10 border border-destructive/20 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left justify-between shadow-sm">
              <div className="flex items-center gap-3 text-destructive">
                <AlertCircle className="w-6 h-6 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Atención: Tu plan expira pronto</h3>
                  <p className="text-sm opacity-90">Tu suscripción actual finalizará en {daysLeft} {daysLeft === 1 ? 'día' : 'días'}.</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PLAN_CONFIG.map((plan) => {
              const isCurrentPlan = currentPlan?.plan === plan.id;
              const isRecommended = plan.recommended;

              return (
                <Card 
                  key={plan.id} 
                  className={`relative flex flex-col h-full transition-all duration-300 ${
                    isRecommended 
                      ? 'border-primary shadow-xl scale-105 z-10' 
                      : 'border-border shadow-sm hover:shadow-md'
                  }`}
                >
                  {isRecommended && (
                    <div className="absolute -top-4 left-0 right-0 flex justify-center">
                      <Badge className="bg-primary text-primary-foreground font-semibold px-4 py-1 flex items-center gap-1 shadow-sm">
                        <Sparkles className="w-3.5 h-3.5" />
                        Recomendado
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pt-8 pb-4">
                    <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                    <div className="mb-2">
                      <span className="text-4xl font-extrabold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {plan.priceLabel}
                      </span>
                      {plan.price > 0 && <span className="text-muted-foreground text-sm font-medium"> /mes (IVA inc.)</span>}
                    </div>
                    <CardDescription className="text-sm mt-4 min-h-[40px]">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 pb-6">
                    <div className="space-y-4 mb-6 pt-4 border-t border-border">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Límite ofertas</span>
                        <span className="font-semibold text-foreground">{plan.limite_ofertas}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Límite candidatos</span>
                        <span className="font-semibold text-foreground">{plan.limite_candidatos}</span>
                      </div>
                    </div>

                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                          <div className="mt-0.5 rounded-full bg-primary/10 p-0.5 flex-shrink-0">
                            <Check className="w-3.5 h-3.5 text-primary" />
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {plan.highlightedText && (
                      <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                        <p className="text-sm text-primary font-medium leading-relaxed">
                          {plan.highlightedText}
                        </p>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="pt-4 pb-8 mt-auto border-t border-border/50">
                    {isCurrentPlan ? (
                      <Button className="w-full" variant="secondary" disabled>
                        Plan Actual
                      </Button>
                    ) : plan.id === 'gratis' ? (
                      <Button className="w-full" variant="outline" disabled>
                        Plan por defecto
                      </Button>
                    ) : (
                      <Button 
                        className="w-full font-semibold" 
                        variant={isRecommended ? 'default' : 'outline'}
                        onClick={() => handleSubscribe(plan.id)}
                        disabled={isProcessing === plan.id}
                      >
                        {isProcessing === plan.id ? (
                          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Procesando...</>
                        ) : (
                          plan.buttonText
                        )}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>

        </div>
      </div>
    </>
  );
};

export default PlanesEmpresa;