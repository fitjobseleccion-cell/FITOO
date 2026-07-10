import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { toast } from 'sonner';

const AdminApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const records = await pb.collection('candidaturas').getFullList({
        sort: '-created',
        expand: 'oferta_id',
        $autoCancel: false
      });
      setApplications(records);
    } catch (error) {
      toast.error('Error al cargar candidaturas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await pb.collection('candidaturas').update(id, { estado: newStatus }, { $autoCancel: false });
      toast.success('Estado actualizado');
      fetchApplications(); // Refresh to show new state
    } catch (error) {
      toast.error('Error al actualizar estado');
    }
  };

  const filteredApps = statusFilter === 'all' 
    ? applications 
    : applications.filter(a => a.estado === statusFilter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Recibido': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'En revisión': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Preseleccionado': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Entrevista': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Finalista': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Contratado': return 'bg-green-100 text-green-800 border-green-200';
      case 'Descartado': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestión de Candidaturas</h1>
        <p className="text-muted-foreground">Visualiza y cambia el estado de los procesos de selección.</p>
      </div>

      <div className="flex gap-4 mb-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px] bg-card">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="Recibido">Recibido</SelectItem>
            <SelectItem value="En revisión">En revisión</SelectItem>
            <SelectItem value="Preseleccionado">Preseleccionado</SelectItem>
            <SelectItem value="Entrevista">Entrevista</SelectItem>
            <SelectItem value="Finalista">Finalista</SelectItem>
            <SelectItem value="Contratado">Contratado</SelectItem>
            <SelectItem value="Descartado">Descartado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Candidato</TableHead>
              <TableHead>Oferta</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado Actual</TableHead>
              <TableHead>Cambiar Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8">Cargando...</TableCell></TableRow>
            ) : filteredApps.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No hay candidaturas</TableCell></TableRow>
            ) : (
              filteredApps.map(app => (
                <TableRow key={app.id}>
                  <TableCell>
                    <div className="font-medium">{app.nombre} {app.apellidos}</div>
                    <div className="text-xs text-muted-foreground">{app.email}</div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {app.expand?.oferta_id?.puesto || app.expand?.oferta_id?.titulo || 'Desconocida'}
                  </TableCell>
                  <TableCell>{new Date(app.created).toLocaleDateString('es-ES')}</TableCell>
                  <TableCell>
                    <Badge className={`shadow-none ${getStatusColor(app.estado)}`} variant="outline">
                      {app.estado || 'Recibido'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select value={app.estado || 'Recibido'} onValueChange={(val) => handleStatusChange(app.id, val)}>
                      <SelectTrigger className="w-[180px] h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Recibido">Recibido</SelectItem>
                        <SelectItem value="En revisión">En revisión</SelectItem>
                        <SelectItem value="Preseleccionado">Preseleccionado</SelectItem>
                        <SelectItem value="Entrevista">Entrevista</SelectItem>
                        <SelectItem value="Finalista">Finalista</SelectItem>
                        <SelectItem value="Contratado">Contratado</SelectItem>
                        <SelectItem value="Descartado">Descartado</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminApplicationsPage;