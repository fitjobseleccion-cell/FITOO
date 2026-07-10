import React, { useState } from 'react';
import { Search, MapPin, Briefcase, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PROVINCIAS = ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Málaga', 'Zaragoza', 'Remoto'];

const BuscadorOfertas = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    keyword: '',
    provincia: '',
    modalidad: '',
    ordenamiento: 'relevancia'
  });

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 -mt-8 relative z-10 mx-auto max-w-5xl">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Puesto, empresa o palabra clave"
              className="!pl-11 block w-full h-12 bg-slate-50 border-slate-200 rounded-lg"
              value={filters.keyword}
              onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
            />
          </div>

          <div className="relative">
            <Select onValueChange={(val) => setFilters({ ...filters, provincia: val === 'all' ? '' : val })}>
              <SelectTrigger className="h-12 pl-10 bg-slate-50 border-slate-200">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-slate-400" />
                </div>
                <SelectValue placeholder="Cualquier provincia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Cualquier provincia</SelectItem>
                {PROVINCIAS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="h-12 w-full text-lg">
            Buscar empleo
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-100 mt-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Filter className="w-4 h-4" /> Filtros:
          </div>
          
          <Select onValueChange={(val) => setFilters({ ...filters, modalidad: val === 'all' ? '' : val })}>
            <SelectTrigger className="w-[180px] h-9 text-sm bg-slate-50">
              <SelectValue placeholder="Modalidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Cualquier modalidad</SelectItem>
              <SelectItem value="presencial">Presencial</SelectItem>
              <SelectItem value="hibrido">Híbrido</SelectItem>
              <SelectItem value="remoto">Remoto</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={(val) => setFilters({ ...filters, ordenamiento: val })}>
            <SelectTrigger className="w-[180px] h-9 text-sm bg-slate-50 ml-auto">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevancia">Relevancia</SelectItem>
              <SelectItem value="fecha_reciente">Fecha más reciente</SelectItem>
              <SelectItem value="salario_mayor">Salario (Mayor a menor)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </form>
    </div>
  );
};

export default BuscadorOfertas;