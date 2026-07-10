import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Search, Plus, Edit, Trash2, Eye, Copy, MoreHorizontal, CheckCircle, XCircle } from 'lucide-react';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

const AdminJobsPage = () => {
  // All hooks at the top
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [filterContrato, setFilterContrato] = useState('todos');
  const [filterModalidad, setFilterModalidad] = useState('todos');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const filters = [];
      if (debouncedSearch) {
        filters.push(`(puesto ~ "${debouncedSearch}" || titulo ~ "${debouncedSearch}" || empresa ~ "${debouncedSearch}" || ciudad ~ "${debouncedSearch}")`);
      }
      if (filterEstado !== 'todos') filters.push(`estado = "${filterEstado}"`);
      if (filterContrato !== 'todos') filters.push(`tipo_contrato = "${filterContrato}"`);
      if (filterModalidad !== 'todos') filters.push(`modalidad = "${filterModalidad}"`);

      const filterString = filters.join(' && ');

      const result = await pb.collection('ofertas').getList(page, perPage, {
        filter: filterString,
        sort: '-created',
        $autoCancel: false
      });
      
      setJobs(result.items);
      setTotalPages(result.totalPages);
      setTotalItems(result.totalItems);
    } catch (error) {
      toast.error('Error al cargar ofertas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, perPage, debouncedSearch, filterEstado, filterContrato, filterModalidad]);

  // Logic after hooks
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta oferta de forma permanente? Esta acción no se puede deshacer.')) {
      try {
        await pb.collection('ofertas').delete(id, { $autoCancel: false });
        toast.success('Oferta eliminada correctamente');
        fetchJobs();
      } catch (error) {
        toast.error('Error al eliminar la oferta');
      }
    }
  };

  const handleChangeStatus = async (id, newStatus) => {
    const statusText = newStatus === 'publicada' ? 'publicar' : newStatus === 'cerrada' ? 'cerrar' : 'cambiar a borrador';
    if (window.confirm(`¿Seguro que deseas ${statusText} esta oferta?`)) {
      try {
        const data = { estado: newStatus };
        if (newStatus === 'publicada') data.fecha_publicacion = new Date().toISOString();
        
        await pb.collection('ofertas').update(id, data, { $autoCancel: false });
        toast.success(`Oferta ${newStatus} exitosamente`);
        fetchJobs();
      } catch (error) {
        toast.error(`Error al cambiar el estado`);
      }
    }
  };

  const handleDuplicate = async (job) => {
    if (window.confirm('¿Deseas crear una copia exacta de esta oferta como borrador?')) {
      try {
        const duplicateData = { ...job };
        delete duplicateData.id;
        delete duplicateData.created;
        delete duplicateData.updated;
        duplicateData.titulo = `${duplicateData.titulo || duplicateData.puesto} (Copia)`;
        duplicateData.estado = 'borrador';
        duplicateData.fecha_publicacion = '';
        
        const newJob = await pb.collection('ofertas').create(duplicateData, { $autoCancel: false });
        toast.success('Oferta duplicada. Redirigiendo a edición...');
        navigate(`/admin/ofertas/${newJob.id}/editar`);
      } catch (error) {
        toast.error('Error al duplicar la oferta');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Gestión de Ofertas</h1>
          <p className="text-muted-foreground mt-1">Administra todas las vacantes: publica, edita y supervisa los procesos de selección.</p>
        </div>
        <Link to="/admin/ofertas/nueva">
          <Button className="font-bold bg-green-600 hover:bg-green-700 text-white shadow-md">
            <Plus className="w-5 h-5 mr-2" /> Nueva Oferta
          </Button>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-card p-4 rounded-xl border border-border shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <Input 
            className="pl-9" 
            placeholder="Buscar por puesto, empresa o ciudad..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={filterEstado} onValueChange={setFilterEstado}>
          <SelectTrigger><SelectValue placeholder="Estado" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los estados</SelectItem>
            <SelectItem value="publicada">Publicadas</SelectItem>
            <SelectItem value="borrador">Borradores</SelectItem>
            <SelectItem value="cerrada">Cerradas</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterContrato} onValueChange={setFilterContrato}>
          <SelectTrigger><SelectValue placeholder="Contrato" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los contratos</SelectItem>
            <SelectItem value="indefinido">Indefinido</SelectItem>
            <SelectItem value="temporal">Temporal</SelectItem>
            <SelectItem value="prácticas">Prácticas</SelectItem>
            <SelectItem value="autónomo">Autónomo</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterModalidad} onValueChange={setFilterModalidad}>
          <SelectTrigger><SelectValue placeholder="Modalidad" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas las modalidades</SelectItem>
            <SelectItem value="Presencial">Presencial</SelectItem>
            <SelectItem value="Remoto">Remoto</SelectItem>
            <SelectItem value="Híbrido">Híbrido</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50 border-b border-border">
            <TableRow>
              <TableHead className="font-semibold text-slate-700">Puesto</TableHead>
              <TableHead className="font-semibold text-slate-700">Empresa / Ciudad</TableHead>
              <TableHead className="font-semibold text-slate-700">Estado</TableHead>
              <TableHead className="font-semibold text-slate-700">Fecha Cierre</TableHead>
              <TableHead className="font-semibold text-slate-700">Candidatos</TableHead>
              <TableHead className="text-right font-semibold text-slate-700">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">Cargando ofertas...</TableCell></TableRow>
            ) : jobs.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">No se encontraron ofertas con los filtros actuales.</TableCell></TableRow>
            ) : (
              jobs.map(job => (
                <TableRow key={job.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell>
                    <div className="font-bold text-slate-900">{job.puesto || job.titulo}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{job.tipo_contrato} • {job.modalidad}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-slate-700">{job.empresa}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{job.ciudad}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={job.estado === 'publicada' ? 'default' : job.estado === 'borrador' ? 'secondary' : 'destructive'} className="capitalize font-semibold tracking-wide">
                      {job.estado}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {formatDate(job.fecha_cierre)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs">
                        0 /{job.vacantes || 1}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:bg-slate-200"><MoreHorizontal className="w-5 h-5" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <Link to={`/ofertas-de-trabajo/${job.id}`}>
                          <DropdownMenuItem className="cursor-pointer font-medium"><Eye className="w-4 h-4 mr-2 text-slate-500" /> Ver página pública</DropdownMenuItem>
                        </Link>
                        <Link to={`/admin/ofertas/${job.id}/editar`}>
                          <DropdownMenuItem className="cursor-pointer font-medium"><Edit className="w-4 h-4 mr-2 text-blue-500" /> Editar oferta</DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem className="cursor-pointer font-medium" onClick={() => handleDuplicate(job)}>
                          <Copy className="w-4 h-4 mr-2 text-indigo-500" /> Duplicar
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        
                        {job.estado !== 'publicada' && (
                          <DropdownMenuItem className="cursor-pointer font-medium text-green-700 focus:text-green-800" onClick={() => handleChangeStatus(job.id, 'publicada')}>
                            <CheckCircle className="w-4 h-4 mr-2" /> Publicar ahora
                          </DropdownMenuItem>
                        )}
                        {job.estado === 'publicada' && (
                          <DropdownMenuItem className="cursor-pointer font-medium text-amber-700 focus:text-amber-800" onClick={() => handleChangeStatus(job.id, 'borrador')}>
                            <XCircle className="w-4 h-4 mr-2" /> Pasar a borrador
                          </DropdownMenuItem>
                        )}
                        {job.estado !== 'cerrada' && (
                          <DropdownMenuItem className="cursor-pointer font-medium text-slate-600 focus:text-slate-800" onClick={() => handleChangeStatus(job.id, 'cerrada')}>
                            <XCircle className="w-4 h-4 mr-2" /> Cerrar proceso
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem className="cursor-pointer font-medium text-red-600 focus:text-red-700 focus:bg-red-50" onClick={() => handleDelete(job.id)}>
                          <Trash2 className="w-4 h-4 mr-2" /> Eliminar permanente
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-slate-50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Mostrar</span>
            <Select value={perPage.toString()} onValueChange={(v) => { setPerPage(Number(v)); setPage(1); }}>
              <SelectTrigger className="w-[70px] h-8 bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span>ofertas por página</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600">
              Mostrando {(page - 1) * perPage + 1} - {Math.min(page * perPage, totalItems)} de {totalItems}
            </span>
            <div className="flex space-x-1">
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1 || loading}>
                Anterior
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0 || loading}>
                Siguiente
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminJobsPage;