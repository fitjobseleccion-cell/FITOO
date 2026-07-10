import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Clock, CalendarDays, ChevronRight, Zap, ArrowUpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const JobCard = ({ job }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getSalaryRange = () => {
    if (!job.salario_minimo && !job.salario_maximo) return 'No especificado';
    if (job.salario_minimo && job.salario_maximo) return `${job.salario_minimo}€ - ${job.salario_maximo}€`;
    if (job.salario_minimo) return `Desde ${job.salario_minimo}€`;
    return `Hasta ${job.salario_maximo}€`;
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group flex flex-col h-full border-border/60">
      <CardContent className="p-6 flex flex-col h-full">
        {/* Badges Section */}
        <div className="flex flex-wrap gap-2 mb-4">
          {job.destacada && (
            <Badge className="badge-destacada border-transparent px-2.5 py-0.5 font-semibold shadow-sm">
              <ArrowUpCircle className="w-3.5 h-3.5 mr-1" /> Destacada
            </Badge>
          )}
          {job.urgente && (
            <Badge className="badge-urgente border-transparent px-2.5 py-0.5 font-semibold shadow-sm">
              <Zap className="w-3.5 h-3.5 mr-1" /> Urgente
            </Badge>
          )}
          {job.incorporacion_inmediata && (
            <Badge className="badge-inmediata border-transparent px-2.5 py-0.5 font-semibold shadow-sm">
              Incorporación inmediata
            </Badge>
          )}
          {job.alta_demanda && (
            <Badge className="badge-demanda border-transparent px-2.5 py-0.5 font-semibold shadow-sm">
              Alta demanda
            </Badge>
          )}
        </div>

        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2">
            {job.puesto || job.titulo}
          </h3>
          <p className="text-muted-foreground font-medium text-sm">
            {job.empresa}
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 gap-3 mb-6">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2 shrink-0 text-primary/60" />
            <span className="truncate">{job.ciudad}{job.provincia ? `, ${job.provincia}` : ''}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Briefcase className="w-4 h-4 mr-2 shrink-0 text-primary/60" />
            <span className="truncate capitalize">{job.tipo_contrato} • {job.modalidad || 'Presencial'}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="w-4 h-4 mr-2 shrink-0 text-primary/60" />
            <span className="truncate capitalize">{job.jornada}</span>
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarDays className="w-4 h-4 mr-2 shrink-0 text-primary/60" />
            <span>Publicado: {formatDate(job.fecha_publicacion || job.created)}</span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
          <div className="text-sm font-semibold text-foreground">
            {getSalaryRange()}
          </div>
          <Link to={`/ofertas-de-trabajo/${job.id}`}>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground font-medium rounded-full pr-3 transition-colors">
              Ver oferta
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;