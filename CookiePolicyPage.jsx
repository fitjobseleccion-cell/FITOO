import React from 'react';
import { Helmet } from 'react-helmet';
import { ChevronRight, Cookie } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useConsentContext } from '../contexts/CookieConsentContext.jsx';
import { Button } from '@/components/ui/button';

const CookiePolicyPage = () => {
  const { openPreferences } = useConsentContext();

  return (
    <>
      <Helmet>
        <title>Política de Cookies | FITJOB</title>
        <meta name="description" content="Política de cookies de FITJOB. Información detallada sobre cómo y por qué utilizamos cookies en nuestra plataforma." />
      </Helmet>

      <div className="min-h-screen bg-background pt-24 pb-20">
        <div className="container max-w-4xl mx-auto px-4">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary transition-colors">Inicio</Link>
            <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
            <span className="text-foreground font-medium">Política de Cookies</span>
          </nav>

          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
              <Cookie className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">Política de Cookies</h1>
              <p className="text-muted-foreground mt-1">Última actualización: 4 de Junio, 2026</p>
            </div>
          </div>

          <div className="bg-muted/50 border border-border rounded-xl p-6 mb-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-semibold text-foreground mb-1">Tus preferencias actuales</h3>
              <p className="text-sm text-muted-foreground max-w-lg">
                Puedes cambiar de opinión en cualquier momento revisando y actualizando tu configuración de cookies.
              </p>
            </div>
            <Button onClick={openPreferences} className="bg-foreground text-background hover:bg-foreground/90 shrink-0">
              Personalizar Configuración
            </Button>
          </div>

          <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:text-muted-foreground prose-li:text-muted-foreground">
            
            <section className="mb-10">
              <h2>1. ¿Qué son las Cookies?</h2>
              <p>
                Las cookies son pequeños archivos de texto que los sitios web almacenan en el dispositivo del usuario (ordenador, smartphone, tablet) a través del navegador. Estos archivos permiten que el sitio web recuerde información sobre la visita, como el idioma preferido, configuración de visualización o el estado de inicio de sesión, lo que facilita y optimiza la navegación en futuras visitas.
              </p>
            </section>

            <section className="mb-10">
              <h2>2. Tipos de Cookies que Utiliza FITJOB</h2>
              <p>
                Clasificamos las cookies que utilizamos en cuatro categorías principales. Únicamente las "Estrictamente Necesarias" están siempre activas. El resto requiere tu consentimiento previo explícito.
              </p>
              
              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Cookies Estrictamente Necesarias</h3>
              <p>
                Son esenciales para el funcionamiento correcto de nuestra página web y no pueden desactivarse en nuestros sistemas. Generalmente, solo se configuran en respuesta a acciones realizadas al solicitar servicios, como establecer preferencias de privacidad, iniciar sesión o rellenar formularios y procesos de pago seguros.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Cookies Analíticas</h3>
              <p>
                Nos permiten contar las visitas y fuentes de tráfico para poder evaluar y mejorar el rendimiento de nuestro sitio web. Nos ayudan a saber qué páginas son las más o las menos visitadas, y cómo los visitantes navegan por el sitio. Usamos servicios como Google Analytics. Toda la información que recogen es agregada y, por lo tanto, anónima.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Cookies de Marketing y Publicidad</h3>
              <p>
                Pueden ser establecidas a través de nuestro sitio web por nuestros socios publicitarios (como Meta o Google). Estas empresas pueden utilizarlas para crear un perfil de tus intereses y mostrarte anuncios relevantes en otros sitios. Si no permites estas cookies, verás menos publicidad dirigida.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Cookies Funcionales</h3>
              <p>
                Permiten que el sitio web proporcione una mejor funcionalidad y personalización. Pueden ser establecidas por nosotros o por proveedores externos cuyos servicios hemos agregado a nuestras páginas, como herramientas de soporte por chat.
              </p>
            </section>

            <section className="mb-10">
              <h2>3. Gestión de Cookies desde el Navegador</h2>
              <p>
                Además de nuestro panel de configuración, puedes restringir, bloquear o borrar las cookies de FITJOB o de cualquier otra página web configurando las opciones de tu navegador. La forma de hacerlo varía según cada navegador:
              </p>
              <ul>
                <li><strong>Google Chrome:</strong> Configuración &gt; Privacidad y seguridad &gt; Cookies y otros datos de sitios.</li>
                <li><strong>Mozilla Firefox:</strong> Opciones &gt; Privacidad &amp; Seguridad &gt; Cookies y datos del sitio.</li>
                <li><strong>Safari:</strong> Preferencias &gt; Privacidad &gt; Bloquear todas las cookies.</li>
                <li><strong>Microsoft Edge:</strong> Ajustes &gt; Permisos de sitio y datos &gt; Cookies y datos del sitio.</li>
              </ul>
              <p>
                Ten en cuenta que si bloqueas todas las cookies en tu navegador (incluyendo las necesarias), es posible que no puedas acceder a partes de nuestra página o finalizar procesos de compra.
              </p>
            </section>

            <section className="mb-10">
              <h2>4. Enlaces a otras Políticas</h2>
              <p>
                Para obtener información más detallada sobre cómo tratamos tus datos personales, tus derechos y los mecanismos para ejercerlos, te invitamos a revisar nuestra <Link to="/privacy-policy" className="text-primary hover:underline">Política de Privacidad</Link>.
              </p>
              <p>
                Si tienes cualquier duda relacionada con el uso de cookies en nuestra plataforma, puedes contactarnos en <strong>fitjob.seleccion@gmail.com</strong>.
              </p>
            </section>

          </article>
        </div>
      </div>
    </>
  );
};

export default CookiePolicyPage;