import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

const planes = [
  {
    id: 'basico',
    nombre: 'PLAN BÁSICO',
    precio: 36.50,
    subtitulo: 'Pago por oferta',
    colorClass: 'plan-card-starter',
    btnClass: 'bg-[hsl(var(--plan-starter))] hover:bg-[hsl(var(--plan-starter))/90] text-white',
    btnText: 'Elegir plan',
    features: [
      '2 ofertas',
      '38 candidatos',
      'Redes sociales',
      'Soporte por correo'
    ]
  },
  {
    id: 'empresa',
    nombre: 'PLAN EMPRESA',
    precio: 59.00,
    subtitulo: 'Pago por oferta',
    colorClass: 'plan-card-business',
    btnClass: 'bg-[hsl(var(--plan-business))] hover:bg-[hsl(var(--plan-business))/90] text-white',
    btnText: 'Elegir plan',
    features: [
      '3 ofertas',
      '60 candidatos',
      'Redes sociales',
      'Soporte prioritario'
    ]
  },
  {
    id: 'seleccion',
    nombre: 'PROCESO DE SELECCIÓN',
    precio: 179.69,
    subtitulo: 'Pago por proceso',
    colorClass: 'plan-card-premium',
    btnClass: 'bg-[hsl(var(--plan-premium))] hover:bg-[hsl(var(--plan-premium))/90] text-white',
    recomendado: true,
    btnText: 'Solicitar proceso de selección',
    features: [
      'Publicación',
      'Difusión',
      'Criba',
      'Preselección',
      'Entrevistas',
      'Presentación finalistas',
      'Compromiso contratación',
      'Acompañamiento'
    ]
  }
];

const PlanesPage = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleSelectPlan = (plan) => {
    // 1. Save selected plan to React state
    setSelectedPlan(plan);
    
    // 2. Save to localStorage
    localStorage.setItem('fitjobPlanSeleccionado', JSON.stringify(plan));
    
    // 3. Continue to next step without page reload (client-side routing)
    navigate('/checkout-plan');
  };

  return (
    <>
      <Helmet>
        <title>Planes y Precios | FITJOB</title>
      </Helmet>
      
      <div className="min-h-screen bg-muted/30 py-24">
        <div className="container max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6">
              Elige tu plan de publicación
            </h1>
            <p className="text-xl text-muted-foreground">
              Publica ofertas y encuentra los mejores candidatos con nuestras opciones flexibles adaptadas a tu empresa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start max-w-6xl mx-auto">
            {planes.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full"
              >
                <Card className={`plan-card h-full ${plan.colorClass} ${selectedPlan?.id === plan.id ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
                  {plan.recomendado && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[hsl(var(--plan-premium))] text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-md whitespace-nowrap z-20">
                      <Sparkles className="w-4 h-4" /> Recomendado
                    </div>
                  )}
                  
                  <div className="mb-8 text-center mt-2">
                    <h3 className="text-xl font-bold mb-2 tracking-wider">{plan.nombre}</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-extrabold">{plan.precio.toFixed(2).replace('.', ',')}</span>
                      <span className="text-muted-foreground font-medium">€</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{plan.subtitulo}</p>
                  </div>

                  <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-muted-foreground">
                        <Check className="w-5 h-5 shrink-0 text-primary mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full h-12 text-sm md:text-base font-semibold mt-auto whitespace-normal h-auto py-3 ${plan.btnClass}`}
                    onClick={() => handleSelectPlan(plan)}
                  >
                    {selectedPlan?.id === plan.id ? 'Redirigiendo...' : plan.btnText}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PlanesPage;