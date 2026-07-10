import React, { useState } from 'react';
import { Mic, ChevronLeft, CheckCircle2, AlertCircle, RefreshCw, MessageSquare, List, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { INTERVIEW_QUESTIONS_BY_POSITION, INTERVIEW_SCORING_RULES } from '@/lib/interviewQuestionsBank.js';
import { cn } from '@/lib/utils.js';

const InterviewSimulator = ({ onBack }) => {
  const [step, setStep] = useState('select'); // select -> practice -> results
  const [position, setPosition] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [displayMode, setDisplayMode] = useState('all'); // 'all' or 'single'
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleStart = () => {
    if (!position) return;
    console.log(`[InterviewSimulator] Starting simulation for: ${position}`);
    // Get random 3 questions from selected position
    const allQ = [...INTERVIEW_QUESTIONS_BY_POSITION[position]];
    const selectedQ = allQ.sort(() => 0.5 - Math.random()).slice(0, 3);
    setQuestions(selectedQ);
    setAnswers({});
    setCurrentIndex(0);
    setStep('practice');
  };

  const calculateScore = () => {
    console.log("[InterviewSimulator] Calculating scores...");
    let totalScore = 0;
    const breakdown = [];

    questions.forEach((q, idx) => {
      const ans = answers[q.id] || '';
      const words = ans.trim().split(/\s+/).filter(w => w.length > 0).length;
      
      const normalizedAns = ans.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const kwFound = q.keywords.filter(kw => normalizedAns.includes(kw.toLowerCase()));
      
      // Points distribution: 40% keywords, 30% length (min 15 words), 30% completeness (answering anything)
      const kwScore = Math.min(kwFound.length / 3, 1) * (INTERVIEW_SCORING_RULES.weights.keyword * 100);
      const wordScore = Math.min(words / INTERVIEW_SCORING_RULES.minWordCount, 1) * (INTERVIEW_SCORING_RULES.weights.extension * 100);
      const completenessScore = words > 0 ? (INTERVIEW_SCORING_RULES.weights.completeness * 100) : 0;
      
      const qScore = Math.round(kwScore + wordScore + completenessScore);
      totalScore += qScore;
      console.log(`[InterviewSimulator] Q${idx+1} Score: ${qScore} (Words: ${words}, KWs: ${kwFound.join(', ')})`);

      breakdown.push({
        question: q.text,
        score: qScore,
        words,
        keywordsFound: kwFound,
        targetKeywords: q.keywords,
        feedback: qScore >= 80 ? 'Excelente respuesta.' : 
                  words < INTERVIEW_SCORING_RULES.minWordCount ? 'Respuesta muy corta, elabora más tus ejemplos.' :
                  kwFound.length === 0 ? 'Te faltó mencionar palabras clave del sector (mira las sugeridas).' :
                  'Buena respuesta, pero puede ser más específica.'
      });
    });

    const finalScore = Math.round(totalScore / questions.length);
    
    // Identificar strengths / weaknesses
    const sorted = [...breakdown].sort((a,b) => b.score - a.score);
    const strengths = sorted.filter(item => item.score >= 70).slice(0, 2);
    const weaknesses = sorted.filter(item => item.score < 70).slice(0, 2);

    setResults({
      finalScore,
      breakdown,
      strengths,
      weaknesses
    });
    setStep('results');
  };

  const getWordCount = (id) => {
    const text = answers[id] || '';
    return text.trim().split(/\s+/).filter(w => w.length > 0).length;
  };

  const getPosName = (key) => key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

  const renderQuestion = (q, index) => {
    const words = getWordCount(q.id);
    return (
      <div key={q.id} className="bg-card border shadow-sm rounded-xl overflow-hidden animate-fade-in">
        <div className="bg-muted p-4 border-b">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Pregunta {index + 1} de {questions.length}</span>
          <h4 className="font-semibold text-lg">{q.text}</h4>
        </div>
        <div className="p-4">
          <Textarea 
            placeholder="Escribe tu respuesta aquí como si hablaras..."
            className="min-h-[120px] resize-none focus-visible:ring-primary/50"
            value={answers[q.id] || ''}
            onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})}
          />
          <div className="flex justify-between items-center mt-2">
            <span className={cn("text-xs font-medium", words < INTERVIEW_SCORING_RULES.minWordCount ? "text-amber-500" : "text-green-600")}>
              {words} / {INTERVIEW_SCORING_RULES.minWordCount} palabras recomendadas
            </span>
            {words > 0 && words < INTERVIEW_SCORING_RULES.minWordCount && (
              <span className="text-xs text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Muy corta
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-background relative z-50">
      <div className="flex items-center gap-3 p-4 border-b border-border bg-muted/30">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 rounded-full">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="font-bold text-foreground">Simulador de Entrevistas</h2>
          <p className="text-xs text-muted-foreground">Practica respuestas y mejora tu confianza</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
        {step === 'select' && (
          <div className="flex flex-col items-center text-center max-w-md mx-auto py-10 space-y-6 animate-fade-in">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Mic className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Prepara tu próxima entrevista</h3>
              <p className="text-sm text-muted-foreground">
                Selecciona el puesto al que aplicas. FITO te hará 3 preguntas clave frecuentes en selección.
              </p>
            </div>
            
            <div className="w-full text-left space-y-2 mt-4">
              <label className="text-sm font-medium">Puesto objetivo</label>
              <Select value={position} onValueChange={setPosition}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un puesto..." />
                </SelectTrigger>
                <SelectContent zIndex={99999}>
                  {Object.keys(INTERVIEW_QUESTIONS_BY_POSITION).map(key => (
                    <SelectItem key={key} value={key}>{getPosName(key)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleStart} disabled={!position} className="w-full mt-6" size="lg">
              Comenzar Práctica
            </Button>
          </div>
        )}

        {step === 'practice' && (
          <div className="space-y-6 animate-fade-in max-w-2xl mx-auto pb-10">
            <div className="flex justify-between items-center mb-4">
              <div className="bg-primary/5 border border-primary/20 p-3 rounded-lg flex items-start gap-2 flex-1 mr-4">
                <MessageSquare className="w-5 h-5 text-primary flex-shrink-0" />
                <p className="text-xs text-foreground/80">
                  Redacta detallando ejemplos reales. Usa vocabulario específico de tu sector.
                </p>
              </div>
              
              <Tabs value={displayMode} onValueChange={setDisplayMode} className="w-fit">
                <TabsList className="grid w-[120px] grid-cols-2">
                  <TabsTrigger value="single" title="Una a una"><Square className="w-4 h-4"/></TabsTrigger>
                  <TabsTrigger value="all" title="Todas"><List className="w-4 h-4"/></TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {displayMode === 'all' ? (
              <div className="space-y-6">
                {questions.map((q, i) => renderQuestion(q, i))}
                <div className="pt-4 flex justify-end">
                  <Button onClick={calculateScore} size="lg" className="shadow-md">
                    Finalizar y Evaluar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {renderQuestion(questions[currentIndex], currentIndex)}
                <div className="pt-4 flex justify-between items-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentIndex(c => Math.max(0, c - 1))}
                    disabled={currentIndex === 0}
                  >
                    Anterior
                  </Button>
                  
                  {currentIndex < questions.length - 1 ? (
                    <Button onClick={() => setCurrentIndex(c => c + 1)}>
                      Siguiente
                    </Button>
                  ) : (
                    <Button onClick={calculateScore} className="shadow-md">
                      Finalizar y Evaluar
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 'results' && results && (
          <div className="space-y-6 animate-fade-in max-w-2xl mx-auto pb-10">
            <div className="flex flex-col items-center text-center p-6 bg-card border rounded-2xl shadow-sm">
              <div className="text-5xl font-extrabold text-primary mb-2">{results.finalScore}<span className="text-2xl text-muted-foreground">/100</span></div>
              <h3 className="text-xl font-bold mb-1">Puntuación Media</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-sm">Evaluación automática basada en longitud y palabras clave del sector {getPosName(position)}.</p>
              
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 p-3 rounded-lg text-xs text-amber-800 dark:text-amber-400 text-left flex gap-2 w-full max-w-md">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                Esta es una autoevaluación guiada por IA para practicar. No sustituye el criterio de un reclutador humano.
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-lg border-b pb-2">Desglose por Pregunta</h4>
              {results.breakdown.map((item, idx) => (
                <div key={idx} className="bg-card border rounded-xl p-4 shadow-sm space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <p className="font-semibold text-sm">P{idx + 1}: {item.question}</p>
                    <span className={`font-bold px-2 py-1 rounded text-xs whitespace-nowrap ${item.score >= 70 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {item.score} pt
                    </span>
                  </div>
                  
                  <div className="bg-muted/40 p-3 rounded-md text-sm text-foreground/80">
                    <span className="font-medium text-xs block mb-1 text-muted-foreground">Feedback FITO:</span>
                    {item.feedback}
                  </div>

                  {item.targetKeywords && (
                    <div>
                      <span className="text-xs text-muted-foreground font-medium block mb-1">Palabras clave detectadas / esperadas:</span>
                      <div className="flex flex-wrap gap-1">
                        {item.targetKeywords.map(kw => (
                          <span key={kw} className={`text-[10px] px-2 py-0.5 rounded-full ${item.keywordsFound.includes(kw) ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-muted text-muted-foreground border'}`}>
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-6 flex flex-col sm:flex-row gap-3">
              <Button onClick={() => setStep('select')} variant="outline" className="flex-1">
                <RefreshCw className="w-4 h-4 mr-2" />
                Practicar Otro Puesto
              </Button>
              <Button variant="secondary" className="flex-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200" onClick={() => window.open('/contacto', '_blank')}>
                Revisión Profesional por Reclutador
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewSimulator;