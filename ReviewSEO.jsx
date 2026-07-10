import React from 'react';
import { Helmet } from 'react-helmet-async';

const ReviewSEO = ({ averageRating, reviewCount, serviceName = "FITJOB" }) => {
  if (!averageRating || !reviewCount) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": serviceName,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": averageRating.toString(),
      "reviewCount": reviewCount.toString(),
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export default ReviewSEO;