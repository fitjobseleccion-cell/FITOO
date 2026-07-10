import React from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const JobFilters = ({ filters, setFilters, onApply, onClear }) => {
  const handleCheckboxChange = (category, value, checked) => {
    setFilters(prev => {
      const currentList = prev[category] || [];
      const newList = checked 
        ? [...currentList, value]
        : currentList.filter(item => item !== value);
      
      return { ...prev, [category]: newList };
    });
  };

  const hasActiveFilters = Object.values(filters).some(val => 
    (Array.isArray(val) && val.length > 0) || (typeof val === 'boolean' && val)
  );

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden sticky top-24">
      <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
        <div className="flex items-center font-bold text-lg">
          <Filter className="w-5 h-5 mr-2 text-primary" />
          Filtros
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground hover:text-foreground h-8 px-2 text-xs">
            <X className="w-3.5 h-3.5 mr-1" /> Limpiar
          </Button>
        )}
      </div>

      <div className="p-2">
        <Accordion type="multiple" defaultValue={["contrato", "jornada", "modalidad"]} className="w-full">
          
          <AccordionItem value="contrato" className="border-none px-4">
            <AccordionTrigger className="text-base font-semibold hover:no-underline py-4">
              Tipo de contrato
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="space-y-3">
                {['indefinido', 'temporal', 'prácticas', 'autónomo'].map(item => (
                  <div key={item} className="flex items-center space-x-3">
                    <Checkbox 
                      id={`contrato-${item}`} 
                      checked={(filters.contrato || []).includes(item)}
                      onCheckedChange={(checked) => handleCheckboxChange('contrato', item, checked)}
                    />
                    <Label htmlFor={`contrato-${item}`} className="font-medium text-muted-foreground capitalize cursor-pointer">
                      {item}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="jornada" className="border-none px-4">
            <AccordionTrigger className="text-base font-semibold hover:no-underline py-4">
              Jornada
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="space-y-3">
                {['completa', 'media', 'por horas'].map(item => (
                  <div key={item} className="flex items-center space-x-3">
                    <Checkbox 
                      id={`jornada-${item}`} 
                      checked={(filters.jornada || []).includes(item)}
                      onCheckedChange={(checked) => handleCheckboxChange('jornada', item, checked)}
                    />
                    <Label htmlFor={`jornada-${item}`} className="font-medium text-muted-foreground capitalize cursor-pointer">
                      {item}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="modalidad" className="border-none px-4">
            <AccordionTrigger className="text-base font-semibold hover:no-underline py-4">
              Modalidad
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="space-y-3">
                {['Presencial', 'Remoto', 'Híbrido'].map(item => (
                  <div key={item} className="flex items-center space-x-3">
                    <Checkbox 
                      id={`modalidad-${item}`} 
                      checked={(filters.modalidad || []).includes(item)}
                      onCheckedChange={(checked) => handleCheckboxChange('modalidad', item, checked)}
                    />
                    <Label htmlFor={`modalidad-${item}`} className="font-medium text-muted-foreground cursor-pointer">
                      {item}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="otros" className="border-none px-4">
            <AccordionTrigger className="text-base font-semibold hover:no-underline py-4">
              Otros requisitos
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="incorporacion" 
                    checked={filters.incorporacion_inmediata || false}
                    onCheckedChange={(checked) => setFilters(prev => ({...prev, incorporacion_inmediata: checked}))}
                  />
                  <Label htmlFor="incorporacion" className="font-medium text-muted-foreground cursor-pointer">
                    Incorporación inmediata
                  </Label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </div>

      <div className="p-4 border-t border-border bg-muted/30">
        <Button onClick={onApply} className="w-full font-bold">
          Aplicar Filtros
        </Button>
      </div>
    </div>
  );
};

export default JobFilters;