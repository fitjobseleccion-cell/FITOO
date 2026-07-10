import React, { useState } from 'react';
import { Search, MapPin, Briefcase, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function OfferSearchBar({ onSearch }) {
  const [puesto, setPuesto] = useState('');
  const [provincia, setProvincia] = useState('Todas');
  const [modalidad, setModalidad] = useState('Todas');
  const [tipoContrato, setTipoContrato] = useState('Todos');

  const hasValue = 
    puesto.trim() !== '' || 
    provincia !== 'Todas' || 
    modalidad !== 'Todas' || 
    tipoContrato !== 'Todos';

  const handleSearchClick = () => {
    if (onSearch && hasValue) {
      onSearch({
        search: puesto,
        ubicacion: provincia === 'Todas' ? '' : provincia,
        modalidad: modalidad,
        tipo_contrato: tipoContrato
      });
    }
  };

  return (
    <div className="w-full bg-card p-4 rounded-2xl shadow-sm border border-border/50 md:sticky md:top-24 z-30 transition-all duration-300 hover:shadow-md">
      <div className="flex flex-col md:flex-row items-center gap-3">
        {/* Puesto / Keyword */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Cargo, palabra clave o empresa" 
            className="pl-9 h-12 w-full bg-muted/30 border-transparent focus-visible:bg-transparent"
            value={puesto}
            onChange={(e) => setPuesto(e.target.value)}
          />
        </div>

        {/* Provincia */}
        <div className="relative flex-1 w-full md:max-w-[200px]">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10 pointer-events-none" />
          <Select value={provincia} onValueChange={setProvincia}>
            <SelectTrigger className="pl-9 h-12 w-full bg-muted/30 border-transparent focus:ring-primary/20">
              <SelectValue placeholder="Provincia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todas">Toda España</SelectItem>
              <SelectItem value="Madrid">Madrid</SelectItem>
              <SelectItem value="Barcelona">Barcelona</SelectItem>
              <SelectItem value="Valencia">Valencia</SelectItem>
              <SelectItem value="Sevilla">Sevilla</SelectItem>
              <SelectItem value="Zaragoza">Zaragoza</SelectItem>
              <SelectItem value="Málaga">Málaga</SelectItem>
              <SelectItem value="Murcia">Murcia</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Modalidad */}
        <div className="relative flex-1 w-full md:max-w-[180px]">
          <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10 pointer-events-none" />
          <Select value={modalidad} onValueChange={setModalidad}>
            <SelectTrigger className="pl-9 h-12 w-full bg-muted/30 border-transparent focus:ring-primary/20">
              <SelectValue placeholder="Modalidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todas">Cualquier</SelectItem>
              <SelectItem value="Presencial">Presencial</SelectItem>
              <SelectItem value="Híbrido">Híbrido</SelectItem>
              <SelectItem value="Remoto">Remoto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tipo Contrato */}
        <div className="relative flex-1 w-full md:max-w-[180px]">
          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10 pointer-events-none" />
          <Select value={tipoContrato} onValueChange={setTipoContrato}>
            <SelectTrigger className="pl-9 h-12 w-full bg-muted/30 border-transparent focus:ring-primary/20">
              <SelectValue placeholder="Contrato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Cualquier</SelectItem>
              <SelectItem value="indefinido">Indefinido</SelectItem>
              <SelectItem value="temporal">Temporal</SelectItem>
              <SelectItem value="prácticas">Prácticas</SelectItem>
              <SelectItem value="autónomo">Autónomo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <div className="w-full md:w-auto">
          <Button 
            className="w-full h-12 px-8 font-medium transition-all active:scale-[0.98]"
            onClick={handleSearchClick}
            disabled={!hasValue}
          >
            Buscar empleo
          </Button>
        </div>
      </div>
    </div>
  );
}