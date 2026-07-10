import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const ReportManagementTab = ({ reports, onUpdate }) => {
  const handleResolve = async (id) => {
    try {
      await pb.collection('review_reports').update(id, { status: 'resolved' }, { $autoCancel: false });
      toast.success('Reporte marcado como resuelto');
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error('Error al resolver el reporte');
    }
  };

  const handleDeleteReport = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este reporte?')) return;
    try {
      await pb.collection('review_reports').delete(id, { $autoCancel: false });
      toast.success('Reporte eliminado');
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error('Error al eliminar el reporte');
    }
  };

  if (!reports || reports.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-xl border border-border border-dashed">
        <p className="text-muted-foreground">No hay reportes pendientes.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Reportado por</TableHead>
            <TableHead>Motivo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell className="whitespace-nowrap">
                {formatDistanceToNow(new Date(report.created), { addSuffix: true, locale: es })}
              </TableCell>
              <TableCell>
                {report.expand?.userId?.name || report.expand?.userId?.email || 'Usuario'}
              </TableCell>
              <TableCell className="max-w-xs truncate" title={report.reason}>
                {report.reason}
              </TableCell>
              <TableCell>
                <Badge variant={report.status === 'resolved' ? 'outline' : 'destructive'}>
                  {report.status === 'resolved' ? 'Resuelto' : 'Pendiente'}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                {report.status === 'pending' && (
                  <Button size="sm" variant="outline" onClick={() => handleResolve(report.id)}>
                    Resolver
                  </Button>
                )}
                <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteReport(report.id)}>
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReportManagementTab;