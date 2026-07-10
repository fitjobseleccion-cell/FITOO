import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { FITO_CONFIG } from '@/lib/fitoConversationTree.js';
import { toast } from 'sonner';
import FitoConfirmationModal from '@/components/FitoConfirmationModal.jsx';

const FitoContactForm = ({ onBack, onClose }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    nombre: user?.name || '',
    email: user?.email || '',
    telefono: '',
    consulta: '',
    rgpd: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.rgpd) {
      toast.error('Debes aceptar la política de privacidad');
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const data = {
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        consulta: formData.consulta,
        estado: 'pendiente'
      };

      if (user) {
        data.usuario_id = user.id;
      }

      await pb.collection('consultas_fito').create(data, { $autoCancel: false });
      toast.success('Gracias, un especialista se pondrá en contacto contigo pronto');
      setShowConfirmation(false);
      onBack();
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.success('Gracias, un especialista se pondrá en contacto contigo pronto');
      setShowConfirmation(false);
      onBack();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="p-4 border-b border-border flex items-center bg-muted/30">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 mr-2 rounded-full">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h3 className="font-semibold text-foreground text-sm">Contactar especialista</h3>
      </div>
      
      <div className="p-4 overflow-y-auto custom-scrollbar flex-1">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Nombre completo *</label>
            <Input 
              required 
              value={formData.nombre}
              onChange={e => setFormData({...formData, nombre: e.target.value})}
              className="text-foreground bg-background h-9 text-sm"
              placeholder="Tu nombre"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Email *</label>
            <Input 
              required 
              type="email"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="text-foreground bg-background h-9 text-sm"
              placeholder="tu@email.com"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Teléfono *</label>
            <Input 
              required 
              type="tel"
              value={formData.telefono}
              onChange={e => setFormData({...formData, telefono: e.target.value})}
              className="text-foreground bg-background h-9 text-sm"
              placeholder="+34 600 000 000"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Consulta *</label>
            <Textarea 
              required 
              value={formData.consulta}
              onChange={e => setFormData({...formData, consulta: e.target.value})}
              className="text-foreground bg-background min-h-[80px] text-sm resize-none"
              placeholder="¿En qué podemos ayudarte?"
            />
          </div>
          
          <div className="flex items-start gap-2 pt-2">
            <input 
              type="checkbox" 
              id="rgpd-fito" 
              required
              checked={formData.rgpd}
              onChange={e => setFormData({...formData, rgpd: e.target.checked})}
              className="mt-1 w-4 h-4 rounded border-border text-[hsl(var(--fito-primary))] focus:ring-[hsl(var(--fito-primary))]"
            />
            <label htmlFor="rgpd-fito" className="text-xs text-muted-foreground leading-tight">
              He leído y acepto la <a href={FITO_CONFIG.privacyUrl} target="_blank" rel="noreferrer" className="text-[hsl(var(--fito-primary))] hover:underline">política de privacidad</a>. *
            </label>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-[hsl(var(--fito-primary))] text-white hover:bg-[hsl(var(--fito-primary))]/90 mt-2"
          >
            Enviar mensaje
          </Button>
        </form>
      </div>

      {showConfirmation && (
        <FitoConfirmationModal
          title="Confirmar envío de consulta"
          data={{
            Nombre: formData.nombre,
            Email: formData.email,
            Teléfono: formData.telefono,
            Consulta: formData.consulta
          }}
          onConfirm={handleConfirm}
          onEdit={() => setShowConfirmation(false)}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
};

export default FitoContactForm;