import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, ExternalLink, Clock } from 'lucide-react';

const SupportChat = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="mb-4 bg-card border border-border shadow-xl rounded-2xl p-4 w-72 overflow-hidden"
          >
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-border">
              <h4 className="font-bold text-foreground">¿Necesitas ayuda?</h4>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <a 
                href="https://wa.me/34614971837" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 transition-colors group"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium text-sm">Contactar por WhatsApp</span>
                <ExternalLink className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              
              <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 text-muted-foreground">
                <Clock className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-medium text-foreground mb-1">Horario de soporte</p>
                  <p>Lunes a Viernes</p>
                  <p>9:00 - 18:00 (CET)</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:shadow-primary/30 transition-shadow"
        aria-label="Soporte"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
    </div>
  );
};

export default SupportChat;