import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const MOTIVOS_DESCARTE = [
  'Perfil no encaja con el puesto',
  'Se ha seleccionado a otro candidato',
  'Falta de experiencia requerida',
  'Otro'
];

const DescarteModal = ({ isOpen, onClose, candidato, onSuccess }) => {
  const [motivo, setMotivo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!candidato) return;
    
    setIsLoading(true);
    try {
      await pb.collection('candidatos').update(candidato.id, {
        estado_candidatura: 'descartado',
        motivo_descarte: motivo || ''
      }, { $autoCancel: false });
      
      toast.success('Candidato descartado correctamente');
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error('Error descartando candidato:', error);
      toast.error('Ocurrió un error al descartar el candidato.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open) => {
    if (!open && !isLoading) {
      setMotivo('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Descartar Candidato</DialogTitle>
          <DialogDescription>
            Estás a punto de descartar a <span className="font-semibold text-foreground">{candidato?.nombre} {candidato?.apellidos}</span>.
            Opcionalmente, puedes indicar un motivo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="motivo">Motivo del descarte (Opcional)</Label>
            <Select value={motivo} onValueChange={setMotivo}>
              <SelectTrigger id="motivo" className="w-full">
                <SelectValue placeholder="Selecciona un motivo..." />
              </SelectTrigger>
              <SelectContent>
                {MOTIVOS_DESCARTE.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Confirmar descarte
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DescarteModal;