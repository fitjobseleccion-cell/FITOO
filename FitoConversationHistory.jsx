import React from 'react';
import { MessageSquare, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FITO_TRANSLATIONS } from '@/lib/fitoTranslations.js';

const FitoConversationHistory = ({ language = 'es', onContinue, onRestart }) => {
  const t = FITO_TRANSLATIONS[language]?.history || FITO_TRANSLATIONS['es'].history;

  return (
    <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card border shadow-xl rounded-2xl p-6 max-w-sm w-full text-center space-y-4">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
          <MessageSquare className="w-6 h-6 text-primary" />
        </div>
        <h3 className="font-bold text-lg">{t.title}</h3>
        <p className="text-sm text-muted-foreground">{t.message}</p>
        <div className="flex flex-col gap-2 pt-2">
          <Button onClick={onContinue} className="w-full">
            {t.continueBtn}
          </Button>
          <Button onClick={onRestart} variant="outline" className="w-full">
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.restartBtn}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FitoConversationHistory;