import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';

const InscripcionModal = ({ isOpen, onClose, oferta, onSuccess }) => {
  const { user } = useAuth();
  const [step, setStep] = useState('confirm'); // 'confirm' | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const handleConfirm = async () => {
    if (!user) return;
    setStep('loading');
    setErrorMsg('');

    try {
      // Intentamos recuperar datos del CV para rellenar los campos obligatorios de la colección candidatos
      let cvData = null;
      try {
        const cvs = await pb.collection('cv_drafts').getFullList({
          filter: `userId = "${user.id}"`,
          $autoCancel: false
        });
        if (cvs.length > 0) cvData = cvs[0].formData;
      } catch (e) {
        console.log('No CV found, using defaults');
      }

      const candidatoRecord = {
        oferta_id: oferta.id,
        usuario_id: user.id,
        estado_candidatura: 'recibido',
        nombre: cvData?.personalInfo?.firstName || user.name || 'Candidato',
        apellidos: cvData?.personalInfo?.lastName || 'Sin especificar',
        email: cvData?.personalInfo?.email || user.email || '',
        telefono: cvData?.personalInfo?.phone || '000000000',
        ciudad: cvData?.personalInfo?.city || 'Sin especificar',
        provincia: cvData?.personalInfo?.state || 'Sin especificar',
        fecha_nacimiento: '1990-01-01 12:00:00.000Z', // Default format required by PocketBase
        permiso_trabajo: 'sí'
      };

      await pb.collection('candidatos').create(candidatoRecord, { $autoCancel: false });
      
      setStep('success');
      if (onSuccess) onSuccess();

      setTimeout(() => {
        handleClose();
      }, 3000);

    } catch (error) {
      console.error('Error creating candidatura:', error);
      setErrorMsg(error.message || 'No se pudo enviar tu candidatura. Inténtalo de nuevo más tarde.');
      setStep('error');
    }
  };

  const handleClose = () => {
    setStep('confirm');
    setErrorMsg('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <AnimatePresence mode="wait">
          {step === 'confirm' && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <DialogHeader>
                <DialogTitle className="text-xl">Confirmar Inscripción</DialogTitle>
                <DialogDescription>
                  Estás a punto de enviar tu candidatura para la oferta de trabajo.
                </DialogDescription>
              </DialogHeader>
              <div className="bg-muted/50 p-4 rounded-xl border">
                <h3 className="font-semibold text-foreground">{oferta?.puesto || oferta?.titulo}</h3>
                <p className="text-sm text-muted-foreground mt-1">{oferta?.empresa || 'Empresa confidencial'}</p>
              </div>
              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={handleClose}>Cancelar</Button>
                <Button onClick={handleConfirm}>Enviar candidatura</Button>
              </DialogFooter>
            </motion.div>
          )}

          {step === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-10 space-y-4"
            >
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-muted-foreground font-medium">Procesando tu candidatura...</p>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-8 text-center space-y-4"
            >
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">¡Candidatura enviada!</h2>
              <p className="text-muted-foreground">
                Hemos recibido tu candidatura. La empresa la revisará en los próximos días.
              </p>
            </motion.div>
          )}

          {step === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-8 text-center space-y-4"
            >
              <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-2">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Algo salió mal</h2>
              <p className="text-muted-foreground text-sm">{errorMsg}</p>
              <Button onClick={() => setStep('confirm')} variant="outline" className="mt-4">
                Volver a intentar
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default InscripcionModal;