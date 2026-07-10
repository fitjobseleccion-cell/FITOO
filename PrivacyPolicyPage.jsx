import React from 'react';
import { Helmet } from 'react-helmet';
import { ChevronRight, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Política de Privacidad | FITJOB</title>
        <meta name="description" content="Política de privacidad de FITJOB. Conoce cómo recopilamos, usamos y protegemos tus datos personales." />
      </Helmet>

      <div className="min-h-screen bg-background pt-24 pb-20">
        <div className="container max-w-4xl mx-auto px-4">
          
          {/* Simple Inline Breadcrumbs */}
          <nav className="flex items-center text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary transition-colors">Inicio</Link>
            <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
            <span className="text-foreground font-medium">Política de Privacidad</span>
          </nav>

          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">Política de Privacidad</h1>
              <p className="text-muted-foreground mt-1">Última actualización: 4 de Junio, 2026</p>
            </div>
          </div>

          <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:text-muted-foreground prose-li:text-muted-foreground">
            
            <section className="mb-10">
              <h2>1. Introducción</h2>
              <p>
                En FITJOB SL ("nosotros", "nuestro" o "la empresa"), respetamos tu privacidad y nos comprometemos a proteger los datos personales que nos proporcionas. Esta Política de Privacidad explica cómo recopilamos, procesamos, almacenamos y compartimos tu información cuando visitas nuestro sitio web y utilizas nuestros servicios de selección de personal B2B.
              </p>
              <p>
                Este documento ha sido elaborado en estricto cumplimiento del Reglamento General de Protección de Datos (RGPD) de la Unión Europea y la Ley Orgánica 3/2018, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD).
              </p>
            </section>

            <section className="mb-10">
              <h2>2. Responsable del Tratamiento</h2>
              <p>
                La entidad responsable del tratamiento de tus datos personales es:
              </p>
              <ul>
                <li><strong>Denominación Social:</strong> FITJOB SL</li>
                <li><strong>CIF:</strong> B12345678</li>
                <li><strong>Domicilio Social:</strong> Madrid, España</li>
                <li><strong>Correo electrónico:</strong> fitjob.seleccion@gmail.com</li>
                <li><strong>Teléfono:</strong> +34 919 519 018</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2>3. Datos que Recopilamos</h2>
              <p>
                Dependiendo de tu interacción con nuestra plataforma, podemos recopilar diferentes categorías de datos:
              </p>
              <ul>
                <li><strong>Datos de contacto corporativo:</strong> Nombre completo de la persona de contacto, dirección de correo electrónico profesional, número de teléfono.</li>
                <li><strong>Datos de facturación:</strong> Razón social, CIF/NIF, dirección fiscal, detalles de pago (procesados de forma segura a través de Stripe).</li>
                <li><strong>Datos de navegación y uso:</strong> Direcciones IP, tipo de navegador, páginas visitadas, tiempos de sesión, a través de cookies y tecnologías similares.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2>4. Finalidad del Tratamiento</h2>
              <p>
                Utilizamos tus datos personales exclusivamente para los siguientes fines:
              </p>
              <ul>
                <li>Prestar nuestros servicios de búsqueda y selección de talento.</li>
                <li>Gestionar la facturación y el procesamiento de pagos mediante pasarelas seguras (Stripe).</li>
                <li>Atender tus consultas, dudas o soporte técnico vía correo o WhatsApp.</li>
                <li>Mejorar y optimizar nuestro sitio web mediante análisis estadísticos (Google Analytics).</li>
                <li>Enviar comunicaciones comerciales relevantes, siempre y cuando hayas dado tu consentimiento explícito.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2>5. Compartición de Datos con Terceros</h2>
              <p>
                Tus datos no serán vendidos ni alquilados a terceros. Sin embargo, para poder prestar nuestros servicios, podemos compartir información con los siguientes proveedores que actúan como Encargados de Tratamiento:
              </p>
              <ul>
                <li><strong>Stripe:</strong> Procesamiento de pagos seguros.</li>
                <li><strong>Google Analytics:</strong> Análisis de tráfico y rendimiento del sitio web (sujeto a tu consentimiento en las preferencias de cookies).</li>
                <li><strong>Meta (Facebook Pixel):</strong> Análisis de campañas publicitarias (sujeto a tu consentimiento explícito).</li>
                <li>Proveedores de servicios de alojamiento e infraestructura en la nube.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2>6. Tus Derechos (Derechos ARCO y RGPD)</h2>
              <p>
                En cualquier momento, puedes ejercer tus derechos sobre tus datos personales:
              </p>
              <ul>
                <li><strong>Acceso:</strong> Solicitar conocer qué datos tuyos estamos procesando.</li>
                <li><strong>Rectificación:</strong> Pedir la corrección de datos inexactos o incompletos.</li>
                <li><strong>Supresión ("Derecho al olvido"):</strong> Solicitar el borrado de tus datos cuando ya no sean necesarios para los fines recogidos.</li>
                <li><strong>Oposición y Limitación:</strong> Oponerte a tratamientos específicos (como marketing) o solicitar que limitemos temporalmente el uso de tus datos.</li>
                <li><strong>Portabilidad:</strong> Solicitar que te entreguemos tus datos en un formato estructurado.</li>
              </ul>
              <p>
                Para ejercer estos derechos, envíanos un correo a <strong>fitjob.seleccion@gmail.com</strong> indicando en el asunto "Ejercicio de Derechos RGPD".
              </p>
            </section>

            <section className="mb-10">
              <h2>7. Conservación de Datos</h2>
              <p>
                Conservaremos tus datos personales únicamente durante el tiempo estrictamente necesario para cumplir con los fines para los que fueron recogidos, así como para cumplir con las obligaciones legales (por ejemplo, obligaciones fiscales y contables que requieren mantener facturas durante 5 años en España).
              </p>
            </section>

            <section className="mb-10">
              <h2>8. Cookies</h2>
              <p>
                Utilizamos cookies para mejorar la experiencia en nuestro sitio. Para gestionar tus preferencias o conocer en detalle qué cookies utilizamos y cómo configurarlas, por favor visita nuestra <Link to="/cookie-policy" className="text-primary hover:underline">Política de Cookies</Link>.
              </p>
            </section>

          </article>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;