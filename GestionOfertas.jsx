import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, MoreVertical, Edit, Copy, Pause, Play, Lock, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { formatEstadoAdmin } from '@/lib/adminUtils.js';

const GestionOfertas = () => {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOferta, setEditingOferta] = useState(null);

  useEffect(() => {
    // Mock Fetch
    setTimeout(() => {
      setOfertas([
        { id: 1, puesto: 'Desarrollador Frontend React', empresa: 'TechCorp Solutions', estado: 'Publicada', candidatos: 45, fecha: '2026-06-18' },
        { id: 2, puesto: 'Especialista SEO/SEM', empresa: 'Growth & Co', estado: 'Pausada', candidatos: 12, fecha: '2026-06-15' },
        { id: 3, puesto: 'Director de Ventas', empresa: 'Global Trade', estado: 'Borrador', candidatos: 0, fecha: '2026-06-19' },
      ]);
      setLoading(false);
    }, 400);
  }, []);

  const openCreate = () => {
    setEditingOferta(null);
    setIsModalOpen(true);
  };

  const openEdit = (oferta) => {
    setEditingOferta(oferta);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if(window.confirm('¿Estás seguro de eliminar esta oferta?')) {
      setOfertas(ofertas.filter(o => o.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestión de Ofertas</h1>
          <p className="text-slate-500">Crea, edita y administra las ofertas de empleo.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" /> Nueva Oferta
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por puesto o empresa..." 
            className="w-full pl-9 h-10 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-10">
          <Filter className="w-4 h-4 mr-2" /> Filtros
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Puesto / Empresa</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold text-center">Candidatos</th>
                <th className="px-6 py-4 font-semibold">Fecha Pub.</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ofertas.filter(o => o.puesto.toLowerCase().includes(searchTerm.toLowerCase())).map(oferta => {
                const est = formatEstadoAdmin(oferta.estado);
                return (
                  <tr key={oferta.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{oferta.puesto}</p>
                      <p className="text-xs text-slate-500">{oferta.empresa}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${est.color}`}>
                        <est.icon className="w-3.5 h-3.5 mr-1.5" />
                        {est.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-medium">
                      {oferta.candidatos > 0 ? (
                        <Link to={`/admin/candidatos?oferta=${oferta.id}`} className="text-primary hover:underline">
                          {oferta.candidatos}
                        </Link>
                      ) : '0'}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {oferta.fecha}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => window.open(`/ofertas/${oferta.id}`, '_blank')}>
                            <Eye className="w-4 h-4 mr-2" /> Ver pública
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEdit(oferta)}>
                            <Edit className="w-4 h-4 mr-2" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="w-4 h-4 mr-2" /> Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(oferta.id)}>
                            <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Unified Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingOferta ? 'Editar Oferta' : 'Crear Nueva Oferta'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Título del Puesto</label>
              <input type="text" className="w-full p-2 border rounded-md" placeholder="Ej: Frontend Developer" defaultValue={editingOferta?.puesto || ''} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Empresa</label>
              <input type="text" className="w-full p-2 border rounded-md" defaultValue={editingOferta?.empresa || ''} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Provincia</label>
              <select className="w-full p-2 border rounded-md">
                <option>Madrid</option>
                <option>Barcelona</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Descripción corta</label>
              <textarea className="w-full p-2 border rounded-md" rows="3"></textarea>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={() => setIsModalOpen(false)}>
              {editingOferta ? 'Guardar Cambios' : 'Crear Oferta'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GestionOfertas;