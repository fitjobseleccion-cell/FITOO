import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Plus, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';

const AdminQuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const records = await pb.collection('preguntas_cribado').getFullList({
        sort: 'orden',
        expand: 'oferta_id',
        $autoCancel: false
      });
      setQuestions(records);
    } catch (error) {
      toast.error('Error al cargar preguntas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta pregunta?')) {
      try {
        await pb.collection('preguntas_cribado').delete(id, { $autoCancel: false });
        toast.success('Pregunta eliminada');
        fetchQuestions();
      } catch (error) {
        toast.error('Error al eliminar');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Preguntas de Cribado</h1>
          <p className="text-muted-foreground">Gestiona las preguntas personalizadas para las ofertas.</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Nueva Pregunta
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Pregunta</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Oferta Asociada</TableHead>
              <TableHead>Obligatoria</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8">Cargando...</TableCell></TableRow>
            ) : questions.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No hay preguntas de cribado configuradas</TableCell></TableRow>
            ) : (
              questions.map(q => (
                <TableRow key={q.id}>
                  <TableCell className="font-medium max-w-[300px] truncate" title={q.pregunta}>{q.pregunta}</TableCell>
                  <TableCell className="capitalize">{q.tipo?.replace('_', ' ')}</TableCell>
                  <TableCell className="truncate max-w-[200px]">{q.expand?.oferta_id?.titulo || 'Todas'}</TableCell>
                  <TableCell>{q.obligatoria ? 'Sí' : 'No'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(q.id)}><Trash2 className="w-4 h-4" /></Button>
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

export default AdminQuestionsPage;