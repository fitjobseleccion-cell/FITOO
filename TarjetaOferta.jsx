import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Clock, Euro, Zap, Flame, Star, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatSalary, formatDate } from '@/lib/formatters.js';

const TarjetaOferta = ({ offer }) => {
  const isUrgente = offer.etiquetas?.includes('Urgente');
  const isDestacada = offer.etiquetas?.includes('Destacada');

  return (
    <div className="job-card group">
      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {isUrgente && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertCircle className="w-3 h-3 mr-1" /> Urgente
          </span>
        )}
        {isDestacada && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Star className="w-3 h-3 mr-1 fill-current" /> Destacada
          </span>
        )}
        {offer.incorporacion_inmediata && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Zap className="w-3 h-3 mr-1" /> Inmediata
          </span>
        )}
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2">
          {offer.puesto || 'Puesto no especificado'}
        </h3>
        <p className="text-slate-600 font-medium mt-1">{offer.empresa || 'Empresa confidencial'}</p>
      </div>

      <div className="space-y-2 mb-6 text-sm text-slate-600 flex-grow">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="truncate">{offer.ciudad}, {offer.provincia}</span>
        </div>
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
          <span>{offer.tipo_contrato} • {offer.modalidad}</span>
        </div>
        <div className="flex items-center gap-2">
          <Euro className="w-4 h-4 text-slate-400 shrink-0" />
          <span>{formatSalary(offer.salario_min, offer.salario_max)}</span>
        </div>
      </div>

      <p className="text-sm text-slate-500 line-clamp-3 mb-6">
        {offer.descripcion_corta || offer.descripcion?.substring(0, 150) + '...'}
      </p>

      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatDate(offer.fecha_publicacion || new Date().toISOString())}
        </span>
        <Link to={`/ofertas/${offer.id}`}>
          <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
            Ver oferta
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default TarjetaOferta;