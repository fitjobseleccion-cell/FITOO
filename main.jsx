// ⚠️ WORKAROUND TEMPORAL - eliminar cuando soporte de Horizons resuelva
// el proxy /hcgi/api para el dominio personalizado fitjob.es.
// Esto redirige las peticiones de API a la URL de preview, que puede
// cambiar o dejar de existir si Horizons regenera el proyecto.
if (typeof window !== 'undefined' && window.location.hostname === 'fitjob.es') {
  const originalFetch = window.fetch;
  const PREVIEW_API_BASE = 'https://fef788d4-bd8f-4390-bd66-3c5ee3fa2ae2.app-preview.com/hcgi/api';
  
  window.fetch = function (input, init) {
    if (typeof input === 'string' && input.startsWith('/hcgi/api')) {
      const newUrl = PREVIEW_API_BASE + input.replace('/hcgi/api', '');
      console.log('[API Redirect]', input, '→', newUrl);
      return originalFetch(newUrl, init);
    }
    return originalFetch(input, init);
  };
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App.jsx';
import '@/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
	<App />
);