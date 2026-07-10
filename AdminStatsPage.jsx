import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminStatsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Estadísticas Detalladas</h1>
        <p className="text-muted-foreground">Métricas avanzadas y analítica (En construcción).</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm border-border">
          <CardHeader><CardTitle>Tiempo medio de contratación</CardTitle></CardHeader>
          <CardContent className="h-40 flex items-center justify-center">
            <p className="text-4xl font-bold text-primary">18 días</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border">
          <CardHeader><CardTitle>Tasa de conversión</CardTitle></CardHeader>
          <CardContent className="h-40 flex items-center justify-center">
            <p className="text-4xl font-bold text-primary">4.2%</p>
          </CardContent>
        </Card>
      </div>
      <div className="bg-card p-12 text-center rounded-xl border border-dashed border-border">
        <h3 className="text-lg font-medium text-muted-foreground">Próximamente: Gráficos avanzados y exportación de reportes PDF.</h3>
      </div>
    </div>
  );
};

export default AdminStatsPage;