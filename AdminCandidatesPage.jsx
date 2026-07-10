import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Search, Download, FileText, Mail, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const AdminCandidatesPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const records = await pb.collection('candidaturas').getFullList({
          sort: '-created',
          expand: 'oferta_id',
          $autoCancel: false
        });
        setCandidates(records);
      } catch (error) {
        toast.error('Error al cargar candidatos');
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  const filteredCandidates = candidates.filter(c => 
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCvUrl = (record) => {
    if (!record.curriculum) return null;
    return pb.files.getURL(record, record.curriculum);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Base de Candidatos</h1>
        <p className="text-muted-foreground">Listado general de personas que han enviado candidaturas.</p>
      </div>

      <div className="flex items-center max-w-sm bg-card rounded-lg border border-border px-3">
        <Search className="w-5 h-5 text-muted-foreground" />
        <Input 
          className="border-0 shadow-none focus-visible:ring-0" 
          placeholder="Buscar por nombre o email..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email / Teléfono</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Oferta Reciente</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary"/></TableCell></TableRow>
            ) : filteredCandidates.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No hay candidatos</TableCell></TableRow>
            ) : (
              filteredCandidates.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.nombre} {c.apellidos}</TableCell>
                  <TableCell>
                    <div className="text-sm">{c.email}</div>
                    <div className="text-xs text-muted-foreground">{c.telefono}</div>
                  </TableCell>
                  <TableCell>{c.ciudad}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {c.expand?.oferta_id?.puesto || c.expand?.oferta_id?.titulo || 'Desconocida'}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {c.curriculum && (
                      <a href={getCvUrl(c)} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm"><FileText className="w-4 h-4 mr-2" /> CV</Button>
                      </a>
                    )}
                    <a href={`mailto:${c.email}`}>
                      <Button variant="ghost" size="icon"><Mail className="w-4 h-4" /></Button>
                    </a>
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

export default AdminCandidatesPage;