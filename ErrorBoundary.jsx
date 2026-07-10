import React from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // In a real production app, you would log this to Sentry or similar here
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-lg border border-slate-100">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mb-3 text-balance">
              Algo no ha salido como esperábamos
            </h1>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Hemos encontrado un problema inesperado al cargar esta pantalla. Nuestro equipo ya ha sido notificado.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => window.location.reload()} 
                className="w-full sm:w-auto"
              >
                <RefreshCcw className="w-4 h-4 mr-2" /> Intentar de nuevo
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'} 
                className="w-full sm:w-auto"
              >
                <Home className="w-4 h-4 mr-2" /> Volver al inicio
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;