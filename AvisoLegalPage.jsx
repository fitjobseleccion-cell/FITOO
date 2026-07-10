import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from '@/components/ui/card';
import Breadcrumbs from '@/components/Breadcrumbs.jsx';

const AvisoLegalPage = () => {
  return (
    <>
      <Helmet>
        <title>Aviso Legal | FITJOB</title>
        <meta name="description" content="Aviso legal y condiciones de uso del sitio web de FITJOB." />
      </Helmet>
      
      <div className="pt-24 bg-muted/20 min-h-screen pb-20">
        <Breadcrumbs />
        
        <div className="container max-w-4xl mx-auto mt-6">
          <h1 className="text-4xl font-bold mb-8 text-foreground tracking-tight">Aviso Legal</h1>
          
          <Card className="shadow-sm border-border/50">
            <CardContent className="p-8 md:p-12 prose prose-slate max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Información Corporativa</h2>
                <p className="text-muted-foreground leading-relaxed">
                  En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa que el titular de este sitio web es:
                </p>
                <div className="bg-muted/50 rounded-xl p-6 mt-4 text-muted-foreground border border-border/50">
                  <ul className="list-none space-y-2 m-0 p-0">
                    <li><strong>Razón social:</strong> FITJOB SL</li>
                    <li><strong>CIF:</strong> B12345678</li>
                    <li><strong>Domicilio social:</strong> Calle Principal, 123, Madrid, 28001</li>
                    <li><strong>Teléfono:</strong> 919 519 018</li>
                    <li><strong>Email:</strong> <a href="mailto:fitjob.seleccion@gmail.com" className="text-primary hover:underline">fitjob.seleccion@gmail.com</a></li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Condiciones de Uso</h2>
                <p className="text-muted-foreground leading-relaxed">
                  El acceso y/o uso de este portal atribuye la condición de USUARIO, que acepta, desde dicho acceso y/o uso, las Condiciones Generales de Uso aquí reflejadas. El sitio web proporciona el acceso a multitud de informaciones, servicios, programas o datos en Internet pertenecientes a FITJOB SL a los que el USUARIO pueda tener acceso.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Propiedad Intelectual e Industrial</h2>
                <p className="text-muted-foreground leading-relaxed">
                  FITJOB SL por sí o como cesionaria, es titular de todos los derechos de propiedad intelectual e industrial de su página web, así como de los elementos contenidos en la misma (a título enunciativo: imágenes, sonido, audio, vídeo, software o textos; marcas o logotipos, combinaciones de colores, estructura y diseño, etc.). Todos los derechos reservados.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Limitación de Responsabilidad</h2>
                <p className="text-muted-foreground leading-relaxed">
                  FITJOB SL no se hace responsable, en ningún caso, de los daños y perjuicios de cualquier naturaleza que pudieran ocasionar, a título enunciativo: errores u omisiones en los contenidos, falta de disponibilidad del portal o la transmisión de virus o programas maliciosos en los contenidos, a pesar de haber adoptado todas las medidas tecnológicas necesarias para evitarlo.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Legislación Aplicable y Jurisdicción</h2>
                <p className="text-muted-foreground leading-relaxed">
                  La relación entre FITJOB SL y el USUARIO se regirá por la normativa española vigente y cualquier controversia se someterá a los Juzgados y tribunales de la ciudad de Madrid.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AvisoLegalPage;