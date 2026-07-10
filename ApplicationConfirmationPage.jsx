import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ApplicationConfirmationPage = () => {
  const location = useLocation();
  const { candidatura, job } = location.state || {};

  if (!candidatura) {
    return <Navigate to="/ofertas-de-trabajo" replace />;
  }

  return (
    <div className="min-h-screen pt-32 pb-24 bg-muted/20 flex flex-col items-center justify-center px-4">
      <Helmet>
        <title>Candidatura Enviada | FITJOB</title>
      </Helmet>

      <div className="max-w-xl w-full bg-card rounded-3xl shadow-lg border border-border p-8 md:p-12 text-center animate-slide-up">
        <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-success" />
        </div>
        
        <h1 className="text-3xl font-extrabold text-foreground mb-4">
          ¡Candidatura enviada con éxito!
        </h1>
        
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          Hemos recibido tu solicitud para el puesto de <strong className="text-foreground">{job?.puesto || job?.titulo}</strong> en <strong className="text-foreground">{job?.empresa}</strong>. Se ha enviado un email de confirmación a <strong className="text-foreground">{candidatura.email}</strong>.
        </p>

        <div className="bg-muted/50 rounded-2xl p-6 mb-8 text-left">
          <h3 className="font-semibold text-foreground mb-3 text-center">¿Qué pasa ahora?</h3>
          <ul className="space-y-3 text-muted-foreground text-sm">
            <li className="flex items-start">
              <span className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center shrink-0 mr-3 text-xs font-bold mt-0.5">1</span>
              <span>Revisaremos tu perfil cuidadosamente para asegurarnos de que encaja con los requisitos de la oferta.</span>
            </li>
            <li className="flex items-start">
              <span className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center shrink-0 mr-3 text-xs font-bold mt-0.5">2</span>
              <span>Si tu perfil avanza en el proceso, nos pondremos en contacto contigo para concertar una entrevista.</span>
            </li>
            <li className="flex items-start">
              <span className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center shrink-0 mr-3 text-xs font-bold mt-0.5">3</span>
              <span>Puedes revisar el estado de tu candidatura desde tu panel personal.</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/ofertas-de-trabajo" className="w-full sm:w-auto">
            <Button size="lg" className="w-full rounded-xl font-bold">
              <Search className="w-4 h-4 mr-2" />
              Buscar más ofertas
            </Button>
          </Link>
          <Link to="/candidato/mis-candidaturas" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full rounded-xl font-bold">
              Ir a mi panel
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ApplicationConfirmationPage;