import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Download, Lock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CVTemplate from './CVTemplate.jsx';

export default function CVPreview({ data, isPaid, onGeneratePDF, isLoading }) {
  const containerRef = useRef(null);
  const templateRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [originalHeight, setOriginalHeight] = useState(1123);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      const availableWidth = entry.contentRect.width;
      const factor = Math.min(availableWidth / 794, 1.0);
      setScale(factor);
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!templateRef.current) return;
    
    const heightObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      const currentHeight = entry.target.scrollHeight;
      setOriginalHeight(Math.max(1123, currentHeight));
    });

    heightObserver.observe(templateRef.current);
    return () => heightObserver.disconnect();
  }, [data]);

  const handleDownload = () => {
    const nameParts = [data?.nombre, data?.apellidos].filter(Boolean);
    const nameStr = nameParts.length > 0 ? nameParts.join('_').replace(/\s+/g, '_') : 'Candidato';
    const filename = `CV_${nameStr}_FITJOB.pdf`;
    
    // Si no ha pagado, force watermark. Si ha pagado, sin watermark.
    onGeneratePDF('cv-pdf-target', !isPaid, filename);
  };

  return (
    <div className="flex flex-col h-full bg-muted/20 border-l border-border rounded-r-2xl overflow-hidden">
      <div className="p-4 border-b bg-background flex flex-col xl:flex-row xl:items-center justify-between gap-4 sticky top-0 z-20 shrink-0">
        <div>
          {!isPaid ? (
            <>
              <h3 className="font-bold text-sm text-foreground">Tu CV está casi listo</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Desbloquéalo para descargarlo sin marca de agua</p>
            </>
          ) : (
            <>
              <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-primary" /> Listo para descargar
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">Tu CV profesional ya no contiene marca de agua</p>
            </>
          )}
        </div>
        <Button 
          onClick={handleDownload}
          disabled={isLoading}
          className={`shadow-sm shrink-0 font-semibold ${!isPaid ? 'bg-primary/90 hover:bg-primary' : 'bg-primary'}`}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : !isPaid ? (
            <Lock className="w-4 h-4 mr-2" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          {isPaid ? 'Descargar CV' : 'Desbloquear CV (4,99 €)'}
        </Button>
      </div>

      <div 
        ref={containerRef}
        className="custom-scrollbar bg-muted/10"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          overflowY: 'auto',
          overflowX: 'hidden',
          width: '100%',
          height: '100%',
          padding: '20px'
        }}
      >
        <div 
          style={{
            width: `${794 * scale}px`,
            height: `${originalHeight * scale}px`,
            flexShrink: 0,
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <div 
            ref={templateRef}
            className="bg-white shadow-xl origin-top transition-transform duration-100 border border-border relative shrink-0"
            style={{ 
              width: '794px',
              minHeight: '1123px',
              transform: `scale(${scale})`,
              transformOrigin: 'top center'
            }}
          >
            {!isPaid && (
              <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden">
                <div className="text-[80px] font-bold text-black/5 -rotate-45 whitespace-nowrap select-none">
                  FITJOB - Vista Previa
                </div>
              </div>
            )}
            
            <CVTemplate id="cv-pdf-target" data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}