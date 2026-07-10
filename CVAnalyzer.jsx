import React, { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Upload, FileText, CheckCircle2, XCircle, AlertCircle, Download, RefreshCw, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CV_KEYWORDS_BY_SECTOR, ACTION_VERBS, CV_SECTIONS, CV_SCORING_WEIGHTS } from '@/lib/cvAnalysisConfig.js';
import { cn } from '@/lib/utils.js';

// Setup PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const CVAnalyzer = ({ onBack }) => {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const normalizeText = (text) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const extractTextFromPDF = async (fileData) => {
    try {
      console.log("[CVAnalyzer] Starting PDF extraction...");
      const arrayBuffer = await fileData.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      let fullText = '';
      
      const numPages = pdf.numPages;
      console.log(`[CVAnalyzer] Found ${numPages} pages.`);
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + ' ';
      }
      return fullText;
    } catch (err) {
      console.error('[CVAnalyzer] PDF extraction error:', err);
      throw new Error('No se pudo extraer el texto del PDF. Asegúrate de que no esté encriptado y contenga texto seleccionable.');
    }
  };

  const processFile = (uploadedFile) => {
    if (!uploadedFile) return;
    
    if (uploadedFile.type !== 'application/pdf') {
      setError('Por favor, sube un archivo en formato PDF.');
      return;
    }

    if (uploadedFile.size > 5 * 1024 * 1024) {
      setError('El archivo no debe pesar más de 5MB.');
      return;
    }

    setFile(uploadedFile);
    setError('');
    analyzeCV(uploadedFile);
  };

  const handleFileUpload = (e) => {
    processFile(e.target.files?.[0]);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  const analyzeCV = async (fileData) => {
    setIsAnalyzing(true);
    setProgress(10);
    console.log("[CVAnalyzer] Initiating ATS simulation...");

    try {
      // 1. Extraction
      const rawText = await extractTextFromPDF(fileData);
      setProgress(40);
      
      if (rawText.trim().length < 50) {
        throw new Error('El PDF parece estar vacío o contiene solo imágenes.');
      }

      const textNorm = normalizeText(rawText);
      const words = rawText.trim().split(/\s+/).filter(w => w.length > 0);
      const wordCount = words.length;
      console.log(`[CVAnalyzer] Extracted ${wordCount} words.`);

      // 2. Structure Evaluation
      setProgress(60);
      const idealLength = wordCount >= 150 && wordCount <= 1000;
      const foundSections = CV_SECTIONS.filter(sec => textNorm.includes(normalizeText(sec)));
      const structureScore = (foundSections.length >= 4 ? 100 : (foundSections.length / 4) * 100) * (idealLength ? 1 : 0.7);

      // 3. Contact Data
      setProgress(70);
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
      const phoneRegex = /\b(?:\+?34)?[6789]\d{8}\b/g;
      
      const hasEmail = emailRegex.test(rawText);
      const hasPhone = phoneRegex.test(rawText);
      const contactScore = (hasEmail && hasPhone) ? 100 : (hasEmail || hasPhone) ? 50 : 0;
      console.log(`[CVAnalyzer] Email found: ${hasEmail}, Phone found: ${hasPhone}`);

      // 4. Keywords & 5. Action Verbs
      setProgress(85);
      const allSectorKeywords = Object.values(CV_KEYWORDS_BY_SECTOR).flat();
      const foundKeywords = allSectorKeywords.filter(kw => textNorm.includes(normalizeText(kw)));
      const foundVerbs = ACTION_VERBS.filter(verb => textNorm.includes(normalizeText(verb)));

      const keywordsScore = Math.min((foundKeywords.length / 5) * 100, 100); // Max score with 5 unique keywords
      const verbsScore = Math.min((foundVerbs.length / 3) * 100, 100); // Max score with 3 action verbs

      // Weighted Total
      setProgress(95);
      const totalScore = Math.round(
        (structureScore * CV_SCORING_WEIGHTS.structure) +
        (contactScore * CV_SCORING_WEIGHTS.contact) +
        (keywordsScore * CV_SCORING_WEIGHTS.keywords) +
        (verbsScore * CV_SCORING_WEIGHTS.actionVerbs)
      );
      console.log(`[CVAnalyzer] Final score calculated: ${totalScore}`);

      // Label & Recommendations
      let label, color;
      if (totalScore >= 85) { label = '🟢 Excelente'; color = 'text-green-600'; }
      else if (totalScore >= 65) { label = '🟡 Bueno'; color = 'text-amber-500'; }
      else if (totalScore >= 40) { label = '🟠 Mejorable'; color = 'text-orange-500'; }
      else { label = '🔴 Necesita revisión'; color = 'text-red-500'; }

      const recommendations = [];
      if (!idealLength) recommendations.push(wordCount < 150 ? 'Tu CV es muy breve, considera añadir más detalles a tu experiencia.' : 'Tu CV es demasiado largo. Intenta resumirlo a 1-2 páginas.');
      if (foundSections.length < 4) recommendations.push(`Faltan secciones clave. Añade apartados como: ${CV_SECTIONS.filter(s => !foundSections.includes(s)).slice(0, 3).join(', ')}.`);
      if (!hasEmail) recommendations.push('No detectamos un correo electrónico. Es vital para que las empresas te contacten.');
      if (!hasPhone) recommendations.push('Añade un número de teléfono visible y en formato estándar.');
      if (foundKeywords.length < 3) recommendations.push('Usa más palabras clave específicas de tu sector (ej. habilidades técnicas, herramientas).');
      if (foundVerbs.length < 2) recommendations.push('Mejora tus descripciones usando verbos de acción (ej. "lideré", "coordiné").');

      setTimeout(() => {
        setResults({
          totalScore,
          label,
          color,
          details: {
            structure: { score: Math.round(structureScore), text: `${foundSections.length} secciones detectadas, ${wordCount} palabras.` },
            contact: { score: Math.round(contactScore), text: `Email: ${hasEmail ? 'Sí' : 'No'} | Teléfono: ${hasPhone ? 'Sí' : 'No'}` },
            keywords: { score: Math.round(keywordsScore), text: `${foundKeywords.length} palabras clave de la industria encontradas.` },
            verbs: { score: Math.round(verbsScore), text: `${foundVerbs.length} verbos de acción fuertes detectados.` }
          },
          recommendations
        });
        setProgress(100);
        setIsAnalyzing(false);
      }, 800);

    } catch (err) {
      console.error(err);
      setError(err.message || 'Error inesperado al analizar el CV.');
      setIsAnalyzing(false);
      setProgress(0);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResults(null);
    setProgress(0);
    setError('');
  };

  const downloadReportText = () => {
    if (!results) return;
    const text = `ANÁLISIS DE CV - FITO ASISTENTE\n\nPuntuación Global: ${results.totalScore}/100 (${results.label})\n\nDESGLOSE:\n- Estructura: ${results.details.structure.text}\n- Contacto: ${results.details.contact.text}\n- Palabras Clave: ${results.details.keywords.text}\n- Verbos de Acción: ${results.details.verbs.text}\n\nRECOMENDACIONES:\n${results.recommendations.map(r => '- ' + r).join('\n')}`;
    
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Analisis_CV_${new Date().getTime()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-background relative z-50">
      <div className="flex items-center gap-3 p-4 border-b border-border bg-muted/30">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 rounded-full">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="font-bold text-foreground">Analizador de CV</h2>
          <p className="text-xs text-muted-foreground">Optimiza tu currículum para sistemas ATS</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
        {!isAnalyzing && !results && (
          <div 
            className={cn(
              "flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-xl transition-colors relative group",
              isDragging ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50"
            )}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <input 
              type="file" 
              accept=".pdf" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileUpload}
            />
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">
              {isDragging ? 'Suelta el PDF aquí' : 'Sube tu CV en PDF'}
            </h3>
            <p className="text-sm text-muted-foreground max-w-[250px]">
              Analizaremos su estructura, palabras clave y legibilidad ATS de forma automática.
            </p>
            {error && (
              <div className="mt-4 p-3 bg-destructive/10 text-destructive text-sm rounded-lg flex items-start gap-2 max-w-[300px] text-left">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
          </div>
        )}

        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-6">
            <FileText className="w-12 h-12 text-primary animate-pulse" />
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Analizando estructura y contenido...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        )}

        {results && (
          <div className="space-y-6 animate-fade-in">
            {/* Score Header */}
            <div className="bg-card rounded-2xl p-6 border shadow-sm flex flex-col sm:flex-row items-center gap-6">
              <div className="relative flex items-center justify-center w-32 h-32 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-muted opacity-20" strokeWidth="10" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className={results.color} strokeWidth="10" strokeDasharray="283" strokeDashoffset={283 - (283 * results.totalScore) / 100} strokeLinecap="round" />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold">{results.totalScore}</span>
                  <span className="text-xs text-muted-foreground font-medium">/ 100</span>
                </div>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-2xl font-bold mb-1">{results.label}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Puntuación basada en legibilidad ATS y buenas prácticas de selección.
                </p>
                <p className="text-xs text-muted-foreground bg-muted p-2 rounded flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  Este es un análisis automático. No sustituye la valoración humana.
                </p>
              </div>
            </div>

            {/* Recommendations */}
            {results.recommendations.length > 0 && (
              <div>
                <h4 className="font-semibold text-lg mb-3">Puntos de mejora ({results.recommendations.length})</h4>
                <ul className="space-y-2">
                  {results.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-3 bg-red-50/50 dark:bg-red-950/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground/90">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {results.recommendations.length === 0 && (
              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-xl border border-green-100 dark:border-green-900/30 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <p className="font-medium text-green-800 dark:text-green-300">¡Tu CV cumple con todos los requisitos principales! Excelente trabajo.</p>
              </div>
            )}

            {/* Detailed Breakdown */}
            <div>
              <h4 className="font-semibold text-sm mb-3 uppercase tracking-wider text-muted-foreground">Desglose del análisis</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(results.details).map(([key, data]) => (
                  <div key={key} className="bg-card border p-4 rounded-xl shadow-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium capitalize">{key === 'keywords' ? 'Palabras Clave' : key === 'verbs' ? 'Verbos Acción' : key}</span>
                      <span className={`font-bold ${data.score >= 80 ? 'text-green-600' : data.score >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                        {data.score}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{data.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button onClick={downloadReportText} className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Descargar Informe (TXT)
              </Button>
              <Button variant="outline" onClick={handleReset} className="flex-1">
                <RefreshCw className="w-4 h-4 mr-2" />
                Analizar Otro CV
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CVAnalyzer;