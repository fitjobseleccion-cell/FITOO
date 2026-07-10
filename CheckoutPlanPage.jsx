import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Check, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

const PLANS = [
  {
    id: 'free',
    name: 'Básico',
    price: 0,
    description: 'Para probar la plataforma',
    features: ['1 oferta de trabajo activa', 'Visualización limitada de candidatos', 'Soporte estándar'],
    icon: ShieldCheck,
    isRecommended: false
  },
  {
    id: 'medium',
    name: 'Medium',
    price: 99.99,
    description: 'Perfecto para pequeñas empresas',
    features: ['5 ofertas de trabajo activas', 'Acceso completo a candidatos', 'Destacado en búsquedas', 'Soporte prioritario'],
    icon: Zap,
    isRecommended: true
  },
  {
    id: 'max',
    name: 'Max',
    price: 199.99,
    description: 'Para empresas en crecimiento',
    features: ['Ofertas ilimitadas', 'Base de datos de talento', 'Marca empleadora premium', 'Gestor de cuenta dedicado', 'API Access'],
    icon: Sparkles,
    isRecommended: false
  }
];

export default function CheckoutPlanPage() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleContinue = (planId) => {
    setSelectedPlan(planId);
    
    // Validate selection
    const plan = PLANS.find(p => p.id === planId);
    if (!plan) return;

    // Save to local storage for checkout page
    localStorage.setItem('fitjob_selected_plan', JSON.stringify(plan));
    
    toast.success(`Plan ${plan.name} seleccionado`);
    navigate('/checkout');
  };

  return (
    <>
      <Helmet>
        <title>Elige tu Plan | FITJOB</title>
      </Helmet>

      <div className="min-h-screen bg-muted/20 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
              Impulsa tu contratación
            </h1>
            <p className="text-lg text-muted-foreground">
              Elige el plan que mejor se adapte al volumen de contratación de tu empresa y comienza a publicar hoy mismo.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
            {/* Free Plan */}
            <Card className="bg-card text-card-foreground border rounded-2xl p-8 shadow-sm flex flex-col h-full">
              <div className="mb-6">
                <ShieldCheck className="w-10 h-10 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-1">Básico</h3>
                <p className="text-sm text-muted-foreground h-10">{PLANS[0].description}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">€0</span>
                  <span className="text-muted-foreground">/mes</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {PLANS[0].features.map((feat, i) => (
                  <li key={i} className="flex items-start text-sm">
                    <Check className="w-5 h-5 text-muted-foreground mr-3 shrink-0" />
                    <span className="text-muted-foreground">{feat}</span>
                  </li>
                ))}
              </ul>
              <Button 
                variant="outline" 
                className="w-full h-12 text-base"
                onClick={() => handleContinue('free')}
              >
                Comenzar gratis
              </Button>
            </Card>

            {/* Medium Plan (Recommended) */}
            <Card className="bg-card border-2 border-primary rounded-2xl p-8 shadow-xl relative flex flex-col h-full scale-100 md:scale-105 z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full">
                Recomendado
              </div>
              <div className="mb-6">
                <Zap className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-1">Medium</h3>
                <p className="text-sm text-muted-foreground h-10">{PLANS[1].description}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">€99.99</span>
                  <span className="text-muted-foreground">/mes</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {PLANS[1].features.map((feat, i) => (
                  <li key={i} className="flex items-start text-sm">
                    <Check className="w-5 h-5 text-primary mr-3 shrink-0" />
                    <span className="font-medium text-foreground">{feat}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90"
                onClick={() => handleContinue('medium')}
              >
                Seleccionar Medium
              </Button>
            </Card>

            {/* Max Plan */}
            <Card className="bg-secondary text-secondary-foreground border-transparent rounded-2xl p-8 shadow-sm flex flex-col h-full">
              <div className="mb-6">
                <Sparkles className="w-10 h-10 opacity-80 mb-4" />
                <h3 className="text-xl font-semibold mb-1">Max</h3>
                <p className="text-sm opacity-70 h-10">{PLANS[2].description}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">€199.99</span>
                  <span className="opacity-70">/mes</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {PLANS[2].features.map((feat, i) => (
                  <li key={i} className="flex items-start text-sm">
                    <Check className="w-5 h-5 opacity-80 mr-3 shrink-0" />
                    <span className="opacity-90">{feat}</span>
                  </li>
                ))}
              </ul>
              <Button 
                variant="outline" 
                className="w-full h-12 text-base bg-transparent border-secondary-foreground/20 hover:bg-secondary-foreground/10 text-secondary-foreground"
                onClick={() => handleContinue('max')}
              >
                Seleccionar Max
              </Button>
            </Card>
          </div>

        </div>
      </div>
    </>
  );
}