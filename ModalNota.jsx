import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const ModalNota = ({ isOpen, onClose, nota, onSave }) => {
  const [texto, setTexto] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTexto(nota?.texto || '');
    }
  }, [isOpen, nota]);

  const handleSave = () => {
    if (!texto.trim()) return;
    onSave(texto.trim());
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{nota ? 'Editar nota interna' : 'Añadir nueva nota interna'}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escribe tu nota aquí... (solo visible para tu equipo)"
            className="min-h-[150px] resize-none"
            autoFocus
          />
        </div>
        <DialogFooter className="flex sm:justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave} disabled={!texto.trim()}>Guardar nota</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalNota;