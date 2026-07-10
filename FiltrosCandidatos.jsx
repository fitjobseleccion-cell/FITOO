import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FORMATTED_NAMES = {
  puesto: 'Puesto',
  ciudad: 'Ciudad',
  provincia: 'Provincia',
  experiencia: 'Experiencia',
  idiomas: 'Idiomas',
  formacion: 'Formación',
  disponibilidad: 'Disponibilidad',
  jornada: 'Jornada',
  tipo_contrato: 'Tipo de Contrato',
  permiso_trabajo: 'Permiso de Trabajo',
  estado_candidatura: 'Estado'
};

const formatFilterName = (key) => FORMATTED_NAMES[key] || key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ');

const FiltrosCandidatos = ({
  filtrosDisponibles,
  filtrosActivos,
  onFiltroChange,
  onLimpiarFiltros,
  searchQuery,
  onBusquedaChange,
  totalCandidatos
}) => {
  const activeCount = Object.keys(filtrosActivos).length;

  return (
    <Card className="border-border shadow-sm bg-card sticky top-24">
      <CardHeader className="pb-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-primary" />
            Filtros
          </CardTitle>
          {activeCount > 0 && (
            <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Mostrando {totalCandidatos} {totalCandidatos === 1 ? 'candidato' : 'candidatos'}
        </p>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="search" className="text-sm font-semibold">Búsqueda rápida</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              id="search"
              placeholder="Buscar por nombre..." 
              className="pl-9 bg-background"
              value={searchQuery}
              onChange={(e) => onBusquedaChange(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-5">
          {Object.entries(filtrosDisponibles).map(([key, options]) => {
            if (!options || options.length === 0) return null;
            
            return (
              <div key={key} className="space-y-2">
                <Label className="text-sm font-semibold text-foreground/80">
                  {formatFilterName(key)}
                </Label>
                <Select
                  value={filtrosActivos[key] || 'todos'}
                  onValueChange={(val) => onFiltroChange(key, val === 'todos' ? null : val)}
                >
                  <SelectTrigger className="w-full bg-background border-border shadow-sm">
                    <SelectValue placeholder="Cualquiera" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos" className="font-medium text-primary">Cualquiera</SelectItem>
                    {options.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt.charAt(0).toUpperCase() + opt.slice(1).replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          })}
        </div>

        {activeCount > 0 && (
          <Button 
            variant="outline" 
            className="w-full mt-4 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive transition-colors"
            onClick={onLimpiarFiltros}
          >
            <X className="w-4 h-4 mr-2" />
            Limpiar filtros
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default FiltrosCandidatos;