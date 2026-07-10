import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from '@/components/ui/card';
import Breadcrumbs from '@/components/Breadcrumbs.jsx';

const LegalPage = () => {
  return (
    <>
      <Helmet>
        <title>Aviso Legal | FITJOB</title>
        <meta name="description" content="Aviso legal, información corporativa y condiciones de uso del sitio web de FITJOB." />
      </Helmet>
      
      <div className="pt-24 bg-muted/20 min-h-screen pb-20">
        <Breadcrumbs />
        
        <div className="container max-w-4xl mx-auto mt-6">
          <h1 className="text-4xl font-bold mb-8 text-foreground tracking-tight">Aviso Legal</h1>
          
          <Card className="shadow-md border-border">
            <CardContent className="p-8 md:p-12 prose prose-slate max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Responsable y Titular del Sitio Web</h2>
                <p className="text-muted-foreground leading-relaxed">
                  En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se hace constar que la presente página web es titularidad de:
                </p>
                <div className="bg-muted rounded-xl p-6 mt-4 text-muted-foreground">
                  <ul className="list-disc pl-4 space-y-2">
                    <li><strong>Razón social:</strong> FITJOB SL</li>
                    <li><strong>CIF:</strong> B12345678</li>
                    <li><strong>Domicilio social:</strong> Calle Principal, 123, Madrid, 28001</li>
                    <li><strong>Teléfono:</strong> +34 91 123 4567</li>
                    <li><strong>Email de contacto:</strong> <a href="mailto:info@fitjob.es" className="text-primary hover:underline">info@fitjob.es</a></li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Propiedad Intelectual e Industrial</h2>
                <p className="text-muted-foreground leading-relaxed">
                  El diseño del portal y sus códigos fuente, así como los logos, marcas y demás signos distintivos que aparecen en el mismo pertenecen a FITJOB SL y están protegidos por los correspondientes derechos de propiedad intelectual e industrial.
                  <br /><br />
                  Se prohíbe expresamente la reproducción, transformación, distribución, comunicación pública, puesta a disposición, extracción, reutilización, reenvío o la utilización de cualquier naturaleza, por cualquier medio o procedimiento, de cualquiera de los activos, salvo en los casos en que esté legalmente permitido o sea autorizado expresamente por el titular de los correspondientes derechos.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Limitación de Responsabilidad</h2>
                <p className="text-muted-foreground leading-relaxed">
                  El sitio web proporciona información sobre los servicios B2B de selección de personal ofrecidos por la empresa. FITJOB SL no se hace responsable de la legalidad de otros sitios web de terceros desde los que pueda accederse al portal. FITJOB SL tampoco responde por la legalidad de otros sitios web de terceros, que pudieran estar vinculados o enlazados desde este portal.
                  <br /><br />
                  FITJOB SL se reserva el derecho a realizar cambios en el sitio web sin previo aviso, al objeto de mantener actualizada su información, añadiendo, modificando, corrigiendo o eliminando los contenidos publicados o el diseño del portal.
                  <br /><br />
                  FITJOB SL no será responsable del uso que terceros hagan de la información publicada en el portal, ni tampoco de los daños sufridos o pérdidas económicas que, de forma directa o indirecta, produzcan o puedan producir perjuicios económicos, materiales o sobre datos, provocados por el uso de dicha información.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Ley Aplicable y Jurisdicción</h2>
                <p className="text-muted-foreground leading-relaxed">
                  La ley aplicable en caso de disputa o conflicto de interpretación de los términos que conforman este aviso legal, así como cualquier cuestión relacionada con los servicios del presente portal, será la <strong>ley española</strong>. Para la resolución de cualquier conflicto que pueda surgir, las partes se someten a los Jueces y Tribunales de la ciudad de Madrid, renunciando expresamente a cualquier otro fuero que pudiera corresponderles.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default LegalPage;