import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Check, ShieldCheck, ChevronRight, Briefcase, Building, Edit2, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

import apiServerClient from '@/lib/apiServerClient.js';
import pb from '@/lib/pocketbaseClient.js';
import FormularioContratacion from '@/components/formularios/FormularioContratacion.jsx';

const PLANES = [
  { 
    id: 'basico', 
    name: 'PLAN BÁSICO', 
    price: 36.50, 
    colorClass: 'plan-green',
    tagline: 'Tú gestionas el proceso de selección. Nosotros damos visibilidad a tu oferta.',
    features: [
      'Publicación de hasta 2 ofertas', 
      'Hasta 38 candidatos', 
      'Publicación de las ofertas en la web de FITJOB', 
      'Difusión en redes sociales', 
      'Soporte por email'
    ],
    closing: 'Ideal para empresas que prefieren gestionar directamente las candidaturas y el proceso de selección.'
  },
  { 
    id: 'empresa', 
    name: 'PLAN EMPRESA', 
    price: 59.00, 
    colorClass: 'plan-blue',
    tagline: 'Más alcance y más candidatos. Tú realizas la selección.',
    features: [
      'Publicación de hasta 3 ofertas', 
      'Hasta 60 candidatos', 
      'Publicación de las ofertas en la web de FITJOB', 
      'Difusión en redes sociales', 
      'Soporte prioritario'
    ],
    closing: 'Perfecto para empresas con mayor volumen de contratación que desean gestionar internamente el proceso de selección.'
  },
  { 
    id: 'seleccion', 
    name: 'PROCESO DE SELECCIÓN', 
    price: 179.69, 
    colorClass: 'plan-purple',
    tagline: 'Nosotros nos encargamos de todo el proceso para que tú solo entrevistes a los mejores candidatos.',
    features: [
      {text: 'Selección completa realizada por FITJOB', highlight: true}, 
      {text: 'Publicación de las ofertas en la web de FITJOB'}, 
      {text: 'Difusión en redes sociales'}, 
      {text: 'Criba curricular de candidatos'}, 
      {text: 'Entrevistas realizadas por nuestro equipo'}, 
      {text: 'Presentación de candidatos finalistas previamente evaluados'}
    ],
    closing: 'La opción más cómoda y eficiente: ahorra tiempo, reduce el esfuerzo de tu equipo y recibe únicamente los perfiles que mejor encajan con tu vacante.'
  }
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [solicitudData, setSolicitudData] = useState(null);
  const [solicitudId, setSolicitudId] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [email, setEmail] = useState('');
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    // Reload local storage whenever edit modal closes or on mount
    if (!isEditModalOpen) {
      const data = localStorage.getItem('fitjobSolicitudData');
      const id = localStorage.getItem('fitjobSolicitudId');
      if (data) {
        try {
          setSolicitudData(JSON.parse(data));
        } catch (e) {
          console.error('Error parsing solicitud data');
        }
      }
      if (id) setSolicitudId(id);

      if (pb.authStore.isValid && pb.authStore.model?.email) {
        setEmail(pb.authStore.model.email);
      }
    }
  }, [isEditModalOpen]);

  const handleNext = () => {
    if (currentStep === 1 && (!solicitudData || !solicitudId)) {
      toast.error('No encontramos ninguna solicitud activa. Por favor, completa el formulario.');
      return;
    }
    if (currentStep === 2 && !selectedPlan) {
      toast.error('Por favor, selecciona un plan para continuar.');
      return;
    }
    if (currentStep === 3 && !acceptedTerms) {
      toast.error('Debes aceptar los términos y condiciones.');
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleStripeCheckout = async () => {
    if (!email || !email.includes('@')) {
      toast.error('Por favor, introduce un correo electrónico válido.');
      return;
    }

    setIsProcessing(true);
    const loadingToast = toast.loading('Conectando con pasarela de pago segura...');

    try {
      const response = await apiServerClient.fetch('/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planName: selectedPlan.name,
          amount: selectedPlan.price, // Send in euros, backend will convert to cents
          currency: 'eur',
          email: email,
          solicitudId: solicitudId || 'solicitud_demo'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'No se pudo iniciar la sesión de pago.');
      }

      const data = await response.json();
      toast.dismiss(loadingToast);

      if (data.url) {
        window.location.href = data.url;
      } else if (data.sessionId) {
        // Fallback robusto usando Stripe JS nativo
        const { loadStripe } = await import('@stripe/stripe-js');
        const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_dummy');
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      } else {
        throw new Error('Respuesta inválida del servidor de pagos.');
      }

    } catch (error) {
      console.error('Checkout Error:', error);
      toast.dismiss(loadingToast);
      toast.error(error.message);
      setIsProcessing(false);
    }
  };

  const STEPS = ['Resumen de solicitud', 'Selecciona tu plan', 'Confirmación y Términos', 'Pago Seguro'];

  const DataRow = ({ label, value }) => {
    if (!value) return null;
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 py-2 border-b border-border/40 last:border-0">
        <span className="text-muted-foreground font-medium sm:col-span-1">{label}</span>
        <span className="text-foreground font-medium sm:col-span-2">{value}</span>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Finalizar Contratación | FITJOB</title>
      </Helmet>

      <div className="min-h-screen bg-muted/20 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
              Completa tu contratación
            </h1>
            <p className="text-muted-foreground mt-2">
              Paso {currentStep} de 4
            </p>
          </div>

          <div className="step-indicator">
            {STEPS.map((label, i) => (
              <div key={label} className={`step-circle ${currentStep > i + 1 ? 'completed' : currentStep === i + 1 ? 'active' : ''}`}>
                <div className="step-circle-inner shadow-sm">
                  {currentStep > i + 1 ? <Check className="w-6 h-6" /> : i + 1}
                </div>
                <span className="step-label">{label}</span>
              </div>
            ))}
          </div>

          <div className="mt-16 max-w-4xl mx-auto min-h-[400px]">
            {currentStep === 1 && (
              <div className="animate-fade-in space-y-6">
                <Card className="border shadow-sm rounded-2xl overflow-hidden">
                  <div className="bg-primary/5 p-6 border-b border-border/50 flex justify-between items-center">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-primary" />
                      Revisión de tu oferta
                    </h2>
                    {solicitudData && (
                      <Button variant="outline" size="sm" onClick={() => setIsEditModalOpen(true)} className="flex items-center gap-2 h-9">
                        <Edit2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Editar información</span>
                        <span className="sm:hidden">Editar</span>
                      </Button>
                    )}
                  </div>
                  <CardContent className="p-0 sm:p-4">
                    {solicitudData ? (
                      <Accordion type="single" collapsible className="w-full" defaultValue="bloque2">
                        
                        <AccordionItem value="bloque1" className="border-b px-4 sm:px-8">
                          <AccordionTrigger className="text-lg font-bold hover:no-underline">
                            <div className="flex items-center gap-2 text-primary">
                              <Building className="w-5 h-5" />
                              <span className="text-foreground">Datos de la Empresa</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-6">
                            <div className="bg-muted/10 p-4 rounded-xl space-y-1">
                              <DataRow label="Nombre Comercial" value={solicitudData.empresa_nombre} />
                              <DataRow label="CIF" value={solicitudData.empresa_cif} />
                              <DataRow label="Tipo de Negocio" value={solicitudData.empresa_tipo_negocio} />
                              <DataRow label="Representante" value={solicitudData.empresa_representante_nombre} />
                              <DataRow label="Cargo" value={solicitudData.empresa_representante_cargo} />
                              <DataRow label="Email" value={solicitudData.empresa_email} />
                              <DataRow label="Teléfono" value={solicitudData.empresa_telefono} />
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="bloque2" className="border-b px-4 sm:px-8">
                          <AccordionTrigger className="text-lg font-bold hover:no-underline">
                            <div className="flex items-center gap-2 text-primary">
                              <Briefcase className="w-5 h-5" />
                              <span className="text-foreground">Oferta de Empleo</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-6">
                            <div className="bg-muted/10 p-4 rounded-xl space-y-1">
                              <DataRow label="Puesto a cubrir" value={solicitudData.oferta_titulo} />
                              <DataRow label="Vacantes" value={solicitudData.oferta_vacantes} />
                              <DataRow label="Tipo de contrato" value={solicitudData.oferta_tipo_contrato} />
                              <DataRow label="Tipo de jornada" value={solicitudData.oferta_tipo_jornada} />
                              <DataRow label="Fecha incorporación" value={solicitudData.oferta_fecha_incorporacion} />
                              <DataRow label="Ubicación" value={solicitudData.oferta_ubicacion} />
                              <DataRow label="Sueldo aprox." value={solicitudData.oferta_sueldo ? `${solicitudData.oferta_sueldo}€` : null} />
                              <DataRow label="Urgencia" value={solicitudData.oferta_urgencia} />
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="bloque3" className="border-b-0 px-4 sm:px-8">
                          <AccordionTrigger className="text-lg font-bold hover:no-underline">
                            <div className="flex items-center gap-2 text-primary">
                              <Check className="w-5 h-5" />
                              <span className="text-foreground">Perfil Buscado</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-6">
                            <div className="bg-muted/10 p-4 rounded-xl space-y-1">
                              <DataRow label="Experiencia mínima" value={solicitudData.candidato_experiencia_minima} />
                              <DataRow label="Habilidades" value={solicitudData.candidato_habilidades} />
                              <DataRow label="Tipo de turno" value={solicitudData.candidato_tipo_turno} />
                              <DataRow label="Modalidad" value={solicitudData.oferta_modalidad} />
                              <DataRow label="Incentivos" value={solicitudData.candidato_incentivos} />
                              {solicitudData.candidato_descripcion_funciones && (
                                <div className="pt-3 mt-3 border-t border-border/40">
                                  <span className="text-muted-foreground font-medium block mb-1">Funciones principales:</span>
                                  <p className="text-sm font-medium">{solicitudData.candidato_descripcion_funciones}</p>
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                      </Accordion>
                    ) : (
                      <div className="text-center py-12 px-6">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                          <Briefcase className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">No encontramos ninguna solicitud activa</h3>
                        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                          Por favor, completa primero el formulario de contratación para que podamos buscar al candidato ideal.
                        </p>
                        <Button size="lg" onClick={() => navigate('/#servicios')} className="font-semibold shadow-md">
                          Iniciar formulario de contratación
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {currentStep === 2 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold text-center mb-8">Elige el servicio que mejor se adapte</h2>
                <div className="planes-grid grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr items-stretch">
                  {PLANES.map(plan => (
                    <div 
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan)}
                      className={`plan-card-selectable flex flex-col h-full relative ${plan.colorClass} ${selectedPlan?.id === plan.id ? 'plan-selected' : ''}`}
                    >
                      {selectedPlan?.id === plan.id && (
                        <div className="absolute top-4 right-4 text-primary bg-primary/10 p-1.5 rounded-full z-10">
                          <Check className="w-5 h-5" />
                        </div>
                      )}
                      <h3 className="text-lg font-bold text-muted-foreground mb-4">{plan.name}</h3>
                      <div>
                        <span className="text-4xl font-extrabold text-foreground">
                          {plan.price.toFixed(2).replace('.', ',')} €
                        </span>
                        <span className="text-sm text-muted-foreground block mt-1">+ IVA</span>
                      </div>
                      <p className="text-sm text-muted-foreground italic mt-2">
                        {plan.tagline}
                      </p>
                      
                      <div className="mt-6 pt-6 border-t border-border/50 space-y-2 text-left flex-grow">
                        {plan.features.map((feature, idx) => {
                          const isHighlight = typeof feature === 'object' && feature.highlight;
                          const featureText = typeof feature === 'object' ? feature.text : feature;
                          const Icon = isHighlight ? Star : Check;
                          return (
                            <div key={idx} className="flex items-start gap-2">
                              <Icon className={`w-4 h-4 ${isHighlight ? 'text-yellow-500 fill-yellow-500' : 'text-primary'} shrink-0 mt-0.5`} />
                              <span className="text-sm text-foreground">{featureText}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-6 pt-6 border-t border-border/50">
                        <p className="text-sm text-muted-foreground">{plan.closing}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="animate-fade-in">
                <Card className="max-w-2xl mx-auto rounded-2xl shadow-md border overflow-hidden">
                  <div className="bg-muted/30 p-8 border-b border-border">
                    <h2 className="text-2xl font-bold mb-6 text-center">Confirmación de selección</h2>
                    
                    <div className="flex justify-between items-center bg-background p-6 rounded-xl border shadow-sm">
                      <div>
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-1">Servicio seleccionado</p>
                        <p className="text-xl font-bold text-foreground">{selectedPlan?.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-1">Importe</p>
                        <p className="text-2xl font-extrabold text-primary">{selectedPlan?.price.toFixed(2).replace('.', ',')} €</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8 bg-background">
                    <div 
                      className={`flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-colors ${acceptedTerms ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/40'}`}
                      onClick={() => setAcceptedTerms(!acceptedTerms)}
                    >
                      <Checkbox 
                        checked={acceptedTerms} 
                        onCheckedChange={setAcceptedTerms}
                        className="mt-1 w-6 h-6"
                      />
                      <div className="space-y-1 leading-none">
                        <Label className="font-semibold text-base cursor-pointer">Acepto los Términos y Condiciones</Label>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                          Al enviar este formulario, estás dando permiso para que nos pongamos en contacto contigo por teléfono y correo electrónico. Para obtener más información, consulta nuestra <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium" onClick={(e) => e.stopPropagation()}>Política de Privacidad</a>.
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {currentStep === 4 && (
              <div className="animate-fade-in max-w-2xl mx-auto">
                <Card className="rounded-2xl shadow-md border overflow-hidden">
                  <div className="bg-card p-8 border-b">
                    <div className="flex justify-between items-center mb-8 pb-6 border-b">
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">Total a pagar</h2>
                        <p className="text-muted-foreground mt-1">{selectedPlan?.name}</p>
                      </div>
                      <div className="text-4xl font-extrabold text-foreground">
                        {selectedPlan?.price.toFixed(2).replace('.', ',')} €
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label htmlFor="email" className="text-sm font-semibold">Correo electrónico para el recibo</Label>
                      <Input 
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@empresa.com"
                        className="h-14 text-lg bg-background"
                      />
                    </div>
                  </div>

                  <div className="bg-muted/30 p-8 flex flex-col items-center">
                    <Button 
                      size="lg" 
                      className="w-full h-14 text-lg font-bold shadow-lg"
                      onClick={handleStripeCheckout}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Procesando...' : 'Confirmar y pagar'}
                    </Button>
                    <div className="flex items-center gap-2 mt-6 text-sm font-medium text-muted-foreground">
                      <ShieldCheck className="w-5 h-5 text-green-600" />
                      Pago 100% seguro y encriptado
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>

          <div className="step-buttons">
            <Button 
              variant="outline" 
              className="btn-prev border-transparent"
              onClick={handlePrev}
              disabled={currentStep === 1 || isProcessing}
            >
              Atrás
            </Button>
            
            {currentStep < 4 && (
              <Button 
                className="btn-next group"
                onClick={handleNext}
                disabled={currentStep === 1 && (!solicitudData || !solicitudId)}
              >
                Siguiente
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
          </div>

        </div>
      </div>

      <FormularioContratacion 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
      />
    </>
  );
}