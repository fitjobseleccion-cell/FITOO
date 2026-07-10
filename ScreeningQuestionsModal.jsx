import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const ScreeningQuestionsModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    pregunta: '',
    tipo: 'texto',
    obligatoria: true,
    respuesta_descarte: '',
    opciones: '',
    es_permiso_trabajo: false,
    orden: 99
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        pregunta: initialData.pregunta || '',
        tipo: initialData.tipo || 'texto',
        obligatoria: initialData.obligatoria !== false,
        respuesta_descarte: initialData.respuesta_descarte || '',
        opciones: initialData.opciones || '',
        es_permiso_trabajo: initialData.es_permiso_trabajo || false,
        orden: initialData.orden || 99
      });
    } else {
      setFormData({
        pregunta: '',
        tipo: 'texto',
        obligatoria: true,
        respuesta_descarte: '',
        opciones: '',
        es_permiso_trabajo: false,
        orden: 99
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.pregunta.trim()) {
      toast.error('La pregunta no puede estar vacía');
      return;
    }
    
    if (['lista', 'seleccion_unica', 'seleccion_multiple'].includes(formData.tipo) && !formData.opciones.trim()) {
      toast.error('Debes proporcionar las opciones separadas por comas');
      return;
    }

    onSave(formData);
    onClose();
  };

  const hasOptions = ['lista', 'seleccion_unica', 'seleccion_multiple'].includes(formData.tipo);
  const isYesNo = formData.tipo === 'si_no';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Pregunta' : 'Añadir Pregunta de Cribado'}</DialogTitle>
          <DialogDescription>
            Configura una pregunta para filtrar candidatos. Puedes establecer respuestas que descarten automáticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="pregunta">Pregunta *</Label>
            <Textarea
              id="pregunta"
              name="pregunta"
              value={formData.pregunta}
              onChange={handleChange}
              placeholder="Ej. ¿Cuántos años de experiencia tienes en React?"
              className="min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo de Respuesta *</Label>
              <Select value={formData.tipo} onValueChange={(v) => handleSelectChange('tipo', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="texto">Texto libre</SelectItem>
                  <SelectItem value="numero">Número</SelectItem>
                  <SelectItem value="si_no">Sí / No</SelectItem>
                  <SelectItem value="fecha">Fecha</SelectItem>
                  <SelectItem value="lista">Lista desplegable</SelectItem>
                  <SelectItem value="seleccion_unica">Selección única (Radio)</SelectItem>
                  <SelectItem value="seleccion_multiple">Selección múltiple (Checkbox)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="respuesta_descarte">Respuesta de descarte (Opcional)</Label>
              {isYesNo ? (
                <Select value={formData.respuesta_descarte} onValueChange={(v) => handleSelectChange('respuesta_descarte', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ninguna" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Ninguna</SelectItem>
                    <SelectItem value="Si">Si responde 'Sí'</SelectItem>
                    <SelectItem value="No">Si responde 'No'</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="respuesta_descarte"
                  name="respuesta_descarte"
                  value={formData.respuesta_descarte}
                  onChange={handleChange}
                  placeholder="Ej. 0"
                />
              )}
              <p className="text-xs text-muted-foreground">
                Si el candidato da esta respuesta, será marcado para descarte.
              </p>
            </div>
          </div>

          {hasOptions && (
            <div className="space-y-2">
              <Label htmlFor="opciones">Opciones de respuesta *</Label>
              <Textarea
                id="opciones"
                name="opciones"
                value={formData.opciones}
                onChange={handleChange}
                placeholder="Opción 1, Opción 2, Opción 3 (separadas por comas)"
                className="min-h-[80px]"
              />
            </div>
          )}

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="obligatoria"
              name="obligatoria"
              checked={formData.obligatoria}
              onCheckedChange={(checked) => handleSelectChange('obligatoria', checked)}
            />
            <Label htmlFor="obligatoria" className="cursor-pointer font-medium">
              Pregunta obligatoria
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave}>Guardar pregunta</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScreeningQuestionsModal;