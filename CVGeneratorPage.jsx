import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Sparkles, FileText, ChevronRight, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

import CVForm from '@/components/cv/CVForm.jsx';
import CVPreview from '@/components/cv/CVPreview.jsx';
import CVTemplate from '@/components/cv/CVTemplate.jsx';
import { useCVGenerator } from '@/hooks/useCVGenerator.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import apiServerClient from '@/lib/apiServerClient.js';
import { Button } from '@/components/ui/button';

export default function CVGeneratorPage() {
  const { cvData, setCVData, handlePhotoUpload, generatePDF, isLoading, isPaid, setIsPaid, saveStatus } = useCVGenerator();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId && user && !isPaid) {
      verifyPayment(sessionId);
    }
  }, [searchParams, user, isPaid]);

  const verifyPayment = async (sessionId) => {
    try {
      // First check our backend session state to see if webhook processed it
      const draftRes = await apiServerClient.fetch(`/cv-drafts/load?userId=${user.id}`);
      if (draftRes.ok) {
        const draftData = await draftRes.json();
        if (draftData.paymentStatus === 'confirmed') {
          setIsPaid(true);
          toast.success('Pago confirmado. ¡Ya puedes descargar tu CV sin marca de agua!');
          searchParams.delete('session_id');
          setSearchParams(searchParams);
          return;
        }
      }
      
      // Fallback: Check Stripe session directly if webhook is delayed
      const res = await apiServerClient.fetch(`/stripe/session/${sessionId}`);
      if (res.ok) {
        const stripeData = await res.json();
        if (stripeData.status === 'complete' || stripeData.payment_status === 'paid') {
          // Update draft status manually
          await apiServerClient.fetch('/cv-drafts/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.id,
              formData: cvData,
              paymentStatus: 'confirmed',
              serviceId: 'cv-automatico'
            })
          });
          
          setIsPaid(true);
          toast.success('Pago confirmado. ¡Ya puedes descargar tu CV sin marca de agua!');
          searchParams.delete('session_id');
          setSearchParams(searchParams);
        }
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para descargar tu CV.');
      navigate('/login?redirect=/cv-generator');
      return;
    }

    setIsProcessingPayment(true);
    setPaymentError(null);
    try {
      // Guardar el borrador justo antes de ir a pagar
      await apiServerClient.fetch('/cv-drafts/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          formData: cvData,
          paymentStatus: 'pending',
          serviceId: 'cv-automatico'
        })
      });

      const response = await apiServerClient.fetch('/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: 'cv-automatico',
          userId: user.id
        })
      });

      if (!response.ok) {
        throw new Error('No se pudo iniciar el checkout de Stripe');
      }
      
      const data = await response.json();
      
      if (data.url) {
        window.open(data.url, '_self');
      } else {
        throw new Error('La respuesta no incluye URL de redirección');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setPaymentError('No hemos podido iniciar el pago, inténtalo de nuevo en unos segundos.');
      setIsProcessingPayment(false);
    }
  };

  const handleGenerate = (elementId, applyWatermark, filename) => {
    if (applyWatermark && !isPaid) {
      handleCheckout();
    } else {
      generatePDF(elementId, false, filename);
    }
  };

  return (
    <>
      <Helmet>
        <title>Tu CV, listo para conseguir entrevistas | FITJOB</title>
        <meta name="description" content="Crea tu currículum profesional optimizado para ATS en minutos." />
      </Helmet>

      <div className="min-h-[100dvh] bg-background flex flex-col pt-20">
        <div className="container py-8 flex-1 flex flex-col">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl md:text-4xl font-extrabold flex items-center gap-3 tracking-tight text-balance">
                  <FileText className="w-8 h-8 text-primary shrink-0" />
                  Tu CV, listo para conseguir esa entrevista
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-lg text-muted-foreground leading-relaxed text-balance">
                  Rellena tus datos una vez y te devolvemos un currículum profesional, optimizado para pasar los filtros automáticos de las empresas (ATS), en menos de 2 minutos.
                </p>
              </div>
              
              {saveStatus && <p className="text-sm text-gray-600 mt-2">{saveStatus === 'saving' && 'Guardando...'}{saveStatus === 'saved' && <span className="text-green-600">Guardado ✓</span>}{saveStatus === 'error' && <span className="text-red-600">No se pudo guardar</span>}</p>}
            </div>
            
            <div className="flex flex-col items-end shrink-0 w-full md:w-auto">
              {!isPaid && (
                <div className="bg-secondary/50 text-secondary-foreground px-5 py-4 rounded-2xl border shadow-sm flex flex-col gap-3 w-full md:w-[320px]">
                  <div>
                    <p className="text-sm font-bold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Destaca sobre el resto
                    </p>
                    <p className="text-sm opacity-90 mt-1">Elimina la marca de agua por 4,99 €</p>
                  </div>
                  <Button onClick={handleCheckout} disabled={isProcessingPayment} size="default" className="font-bold w-full">
                    {isProcessingPayment ? 'Iniciando pago...' : 'Desbloquear CV'} <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                  
                  {paymentError && (
                    <div className="bg-destructive/10 text-destructive text-xs p-3 rounded-lg flex flex-col gap-2 mt-1">
                      <div className="flex items-start gap-1.5">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span className="font-medium">{paymentError}</span>
                      </div>
                      <Button size="sm" variant="outline" className="self-start h-8 text-xs bg-background" onClick={handleCheckout}>Reintentar</Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Main Workspace */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 lg:border rounded-3xl bg-card lg:shadow-sm overflow-hidden h-[calc(100vh-220px)] min-h-[800px]">
            
            {/* Form Column (60%) */}
            <div className="lg:col-span-7 p-6 overflow-y-auto custom-scrollbar bg-background">
              <CVForm 
                data={cvData} 
                onChange={setCVData} 
                onPhotoUpload={handlePhotoUpload} 
              />
            </div>

            {/* Preview Column (40%) */}
            <div className="lg:col-span-5 h-full hidden lg:block">
              <CVPreview 
                data={cvData} 
                isPaid={isPaid} 
                onGeneratePDF={handleGenerate}
                isLoading={isLoading}
              />
            </div>

            {/* Mobile Preview Button (Sticky Bottom) */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background border-t shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-40">
              <Button 
                onClick={() => {
                  const nameParts = [cvData?.nombre, cvData?.apellidos].filter(Boolean);
                  const nameStr = nameParts.length > 0 ? nameParts.join('_').replace(/\s+/g, '_') : 'Candidato';
                  handleGenerate('cv-pdf-target', !isPaid, `CV_${nameStr}_FITJOB.pdf`);
                }} 
                className="w-full h-14 text-base font-bold rounded-xl"
                disabled={isLoading || isProcessingPayment}
              >
                {isPaid ? 'Descargar PDF Limpio' : 'Desbloquear CV (4,99 €)'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="lg:hidden absolute left-[-9999px] top-[-9999px]">
        <div id="cv-pdf-target-mobile">
          <CVTemplate data={cvData} />
        </div>
      </div>
    </>
  );
}