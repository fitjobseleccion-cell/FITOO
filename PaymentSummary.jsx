import React from 'react';
import { Check, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const SERVICE_DATA = {
  'complete': {
    name: 'Servicio Completo de Selección',
    subtotal: 148.50,
    iva: 31.19,
    total: 179.69,
    includes: [
      'Filtrado de candidatos',
      'Entrevistas personales',
      'Envío de los mejores perfiles',
      'Atención prioritaria'
    ]
  },
  'filtrado': {
    name: 'Filtrado de candidatos',
    subtotal: 30.17,
    iva: 6.33,
    total: 36.50,
    includes: [
      'Búsqueda de candidatos',
      'Filtrado cualificado',
      'Validación de experiencia',
      'Comprobación permiso de trabajo'
    ]
  },
  'envio': {
    name: 'Envío de candidatos',
    subtotal: 48.76,
    iva: 10.24,
    total: 59.00,
    includes: [
      'Filtrado y selección',
      'Citación para entrevista',
      'Envío de perfiles cualificados',
      'Comprobación de experiencia'
    ]
  }
};

const PaymentSummary = ({ selectedService }) => {
  const service = SERVICE_DATA[selectedService || 'complete'];

  return (
    <Card className="border-border/50 shadow-lg sticky top-24 overflow-hidden">
      <div className="bg-slate-950 p-6 text-white">
        <h3 className="text-xl font-bold mb-2">Resumen del Servicio</h3>
        <p className="text-slate-400 text-sm">Activación de búsqueda y selección</p>
      </div>
      
      <CardContent className="p-6 bg-card">
        <div className="space-y-4 mb-6 text-sm">
          <div className="flex justify-between text-muted-foreground items-start gap-4">
            <span className="shrink-0 font-medium">Servicio seleccionado:</span>
            <span className="font-bold text-foreground text-right max-w-[180px]">
              {service.name}
            </span>
          </div>
          
          <div className="pt-4 border-t border-border/50">
            <div className="flex justify-between text-muted-foreground mb-3">
              <span>Subtotal</span>
              <span className="font-medium text-foreground">{service.subtotal.toFixed(2).replace('.', ',')} €</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>IVA (21%)</span>
              <span className="font-medium text-foreground">{service.iva.toFixed(2).replace('.', ',')} €</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-5 border-t border-border/50 mt-2">
            <span className="text-lg font-bold text-foreground">Total a pagar</span>
            <span className="text-3xl font-extrabold text-primary">{service.total.toFixed(2).replace('.', ',')} €</span>
          </div>
        </div>

        <div className="bg-muted/50 rounded-xl p-5 mb-6 border border-border/50">
          <h4 className="font-semibold text-sm mb-4 text-foreground">¿Qué incluye este servicio?</h4>
          <ul className="space-y-3 text-sm">
            {service.includes.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-muted-foreground">
                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground bg-primary/5 p-3 rounded-lg border border-primary/10">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <span>Garantía de confidencialidad FITJOB</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentSummary;