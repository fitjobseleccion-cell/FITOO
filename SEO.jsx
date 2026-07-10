import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = 'FITJOB | Encuentra tu próximo empleo', 
  description = 'Descubre cientos de ofertas validadas y prepárate para dar el siguiente paso en tu carrera profesional con FITJOB.', 
  url = 'https://fitjob.es', 
  ogImage = 'https://fitjob.es/og-image.jpg',
  schema 
}) => {
  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />

      {/* Structured Data (JSON-LD) */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;