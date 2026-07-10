import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from '@/components/ui/card';
import Breadcrumbs from '@/components/Breadcrumbs.jsx';

const TermsPage = () => {
  return (
    <>
      <Helmet>
        <title>Términos y Condiciones | FITJOB</title>
        <meta name="description" content="Términos y condiciones de contratación de los servicios B2B de FITJOB." />
      </Helmet>
      
      <div className="pt-24 bg-muted/20 min-h-screen pb-20">
        <Breadcrumbs />
        
        <div className="container max-w-4xl mx-auto mt-6">
          <h1 className="text-4xl font-bold mb-8 text-foreground tracking-tight">Términos y Condiciones</h1>
          
          <Card className="shadow-sm border-border/50">
            <CardContent className="p-8 md:p-12 prose prose-slate max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Descripción del Servicio</h2>
                <p className="text-muted-foreground leading-relaxed">
                  FITJOB SL ofrece servicios B2B de intermediación, búsqueda, filtrado y selección de personal. Nuestro objetivo es presentar a la empresa cliente candidatos cualificados que se ajusten a las vacantes solicitadas, optimizando el tiempo de reclutamiento.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Cuota de Activación y Pagos</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Para iniciar el proceso de búsqueda y selección, la empresa cliente debe abonar una <strong>cuota de activación de 65€ + IVA (78,65€ en total) por cada vacante solicitada</strong>.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Este pago cubre los costes operativos iniciales de búsqueda activa, publicación en portales, filtrado de currículums y primeras entrevistas. <strong>Este importe no es reembolsable</strong> una vez iniciadas las acciones de búsqueda.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Limitación de Garantías</h2>
                <p className="text-muted-foreground leading-relaxed">
                  FITJOB se compromete a realizar un proceso diligente y profesional para presentar los mejores candidatos disponibles en el mercado. Sin embargo, <strong>el pago de la cuota de activación no garantiza la contratación final</strong> de un candidato, ya que la decisión final de contratación recae exclusivamente en la empresa cliente y depende de la aceptación de la oferta por parte del candidato.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Cancelación del Servicio</h2>
                <p className="text-muted-foreground leading-relaxed">
                  La empresa cliente puede cancelar el proceso de selección en cualquier momento notificándolo por escrito a <a href="mailto:fitjob.seleccion@gmail.com" className="text-primary hover:underline">fitjob.seleccion@gmail.com</a>. La cancelación no dará derecho a la devolución de la cuota de activación previamente abonada.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Resolución de Conflictos</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Para cualquier controversia que pudiera derivarse de la prestación de los servicios, ambas partes se someten a la jurisdicción de los Juzgados y Tribunales de la ciudad de Madrid, aplicando la legislación española vigente.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default TermsPage;