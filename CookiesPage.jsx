import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from '@/components/ui/card';
import Breadcrumbs from '@/components/Breadcrumbs.jsx';

const CookiesPage = () => {
  return (
    <>
      <Helmet>
        <title>Política de Cookies | FITJOB</title>
        <meta name="description" content="Información sobre el uso de cookies en el sitio web de FITJOB." />
      </Helmet>
      
      <div className="pt-24 bg-muted/20 min-h-screen pb-20">
        <Breadcrumbs />
        
        <div className="container max-w-4xl mx-auto mt-6">
          <h1 className="text-4xl font-bold mb-8 text-foreground tracking-tight">Política de Cookies</h1>
          
          <Card className="shadow-sm border-border/50">
            <CardContent className="p-8 md:p-12 prose prose-slate max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-foreground">1. ¿Qué son las cookies?</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Una cookie es un fichero que se descarga en su ordenador al acceder a determinadas páginas web. Las cookies permiten a una página web, entre otras cosas, almacenar y recuperar información sobre los hábitos de navegación de un usuario o de su equipo y, dependiendo de la información que contengan, pueden utilizarse para reconocer al usuario.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Tipos de cookies que utilizamos</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">Cookies Técnicas (Necesarias)</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Son aquellas que permiten al usuario la navegación a través de la página web y la utilización de las diferentes opciones o servicios que en ella existan, como controlar el tráfico, identificar la sesión o realizar el proceso de compra.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">Cookies Analíticas</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Permiten el seguimiento y análisis del comportamiento de los usuarios de los sitios web a los que están vinculadas. La información recogida se utiliza en la medición de la actividad del sitio web para introducir mejoras.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Gestión del Consentimiento</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Al acceder a nuestra web, se muestra un banner informativo sobre el uso de cookies donde puede aceptar todas, rechazarlas o configurarlas. Puede modificar sus preferencias en cualquier momento a través de la configuración de su navegador.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Contacto</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Si tiene dudas sobre esta política de cookies, puede contactar con FITJOB en <a href="mailto:privacy@fitjob.es" className="text-primary hover:underline">privacy@fitjob.es</a>.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default CookiesPage;