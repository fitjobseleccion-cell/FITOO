import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from '@/components/ui/card';
import Breadcrumbs from '@/components/Breadcrumbs.jsx';

const PrivacyPage = () => {
  return (
    <>
      <Helmet>
        <title>Política de Privacidad | FITJOB</title>
        <meta name="description" content="Política de privacidad y protección de datos RGPD de FITJOB SL." />
      </Helmet>
      
      <div className="pt-24 bg-muted/20 min-h-screen pb-20">
        <Breadcrumbs />
        
        <div className="container max-w-4xl mx-auto mt-6">
          <h1 className="text-4xl font-bold mb-8 text-foreground tracking-tight">Política de Privacidad</h1>
          
          <Card className="shadow-sm border-border/50">
            <CardContent className="p-8 md:p-12 prose prose-slate max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Responsable del Tratamiento</h2>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>Identidad:</strong> FITJOB SL<br />
                  <strong>CIF:</strong> B12345678<br />
                  <strong>Dirección:</strong> Calle Principal, 123, Madrid, 28001<br />
                  <strong>Contacto DPO:</strong> <a href="mailto:privacy@fitjob.es" className="text-primary hover:underline">privacy@fitjob.es</a>
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Datos Personales Recogidos</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Para la prestación de nuestros servicios B2B de selección de personal, recopilamos los siguientes datos a través de nuestros formularios:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Nombre de la empresa y CIF.</li>
                  <li>Nombre y apellidos de la persona de contacto.</li>
                  <li>Correo electrónico y número de teléfono.</li>
                  <li>Datos relativos a la vacante (puesto solicitado, número de vacantes).</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Base Legal y Finalidad</h2>
                <p className="text-muted-foreground leading-relaxed">
                  La base legal para el tratamiento de sus datos es el <strong>consentimiento expreso</strong> otorgado al aceptar esta política y la ejecución del contrato de prestación de servicios. La finalidad es gestionar la solicitud de selección de personal, procesar el pago correspondiente y mantener la comunicación necesaria durante el proceso.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Conservación de los Datos</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Los datos personales proporcionados se conservarán durante un plazo máximo de <strong>3 años</strong> desde la finalización de la prestación del servicio, o hasta que el interesado solicite su supresión, manteniéndose bloqueados para atender posibles responsabilidades legales.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Derechos del Usuario (RGPD)</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Usted tiene derecho a obtener confirmación sobre si en FITJOB SL estamos tratando sus datos personales. Puede ejercer los siguientes derechos:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li><strong>Acceso:</strong> Consultar sus datos personales.</li>
                  <li><strong>Rectificación:</strong> Modificar datos inexactos.</li>
                  <li><strong>Supresión:</strong> Solicitar la eliminación de sus datos.</li>
                  <li><strong>Portabilidad:</strong> Recibir sus datos en formato estructurado.</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Para ejercer estos derechos, envíe un correo a <a href="mailto:privacy@fitjob.es" className="text-primary hover:underline">privacy@fitjob.es</a> adjuntando copia de su documento de identidad.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PrivacyPage;