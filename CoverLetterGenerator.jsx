import React, { useState, useEffect } from 'react';
import { Copy, ChevronLeft, RefreshCw, PenTool, CheckCircle2, Download, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { COVER_LETTER_TEMPLATES, EXPERIENCE_PARAGRAPHS_BY_SECTOR, TONE_VARIANTS } from '@/lib/coverLetterTemplates.js';
import { CV_KEYWORDS_BY_SECTOR } from '@/lib/cvAnalysisConfig.js';
import pb from '@/lib/pocketbaseClient.js';
import html2pdf from 'html2pdf.js';
import { toast } from 'sonner';

const CoverLetterGenerator = ({ onBack }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    oferta_id: '',
    empresa: '',
    puesto: '',
    sector: '',
    nombre_candidato: user?.name || '',
    años_experiencia: 'varios años'
  });
  
  const [generatedLetters, setGeneratedLetters] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isLoadingOffer, setIsLoadingOffer] = useState(false);

  useEffect(() => {
    // Attempt to parse years of experience if available in user profile in the future
  }, [user]);

  const loadOfferData = async () => {
    if (!formData.oferta_id) return;
    setIsLoadingOffer(true);
    try {
      console.log(`[CoverLetterGenerator] Fetching offer: ${formData.oferta_id}`);
      const offer = await pb.collection('ofertas').getOne(formData.oferta_id, { $autoCancel: false });
      setFormData(prev => ({
        ...prev,
        empresa: offer.empresa || prev.empresa,
        puesto: offer.titulo || prev.puesto,
        sector: offer.sector || prev.sector
      }));
      toast.success('Datos de la oferta cargados');
    } catch (err) {
      console.error('[CoverLetterGenerator] Offer not found:', err);
      toast.error('No se pudo encontrar la oferta');
    } finally {
      setIsLoadingOffer(false);
    }
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    
    if (!formData.empresa || !formData.puesto || !formData.sector || !formData.nombre_candidato) {
      toast.error('Completa los campos obligatorios para generar la carta.');
      return;
    }

    console.log("[CoverLetterGenerator] Generating templates...");
    const paragraph = EXPERIENCE_PARAGRAPHS_BY_SECTOR[formData.sector] || "Aporto experiencia relevante que me permite sumar valor a los objetivos de la empresa desde el primer día, adaptándome rápidamente a nuevas metodologías de trabajo.";

    const letters = {};
    
    Object.keys(COVER_LETTER_TEMPLATES).forEach(tone => {
      let text = COVER_LETTER_TEMPLATES[tone];
      text = text.replace(/{empresa}/g, formData.empresa);
      text = text.replace(/{puesto}/g, formData.puesto);
      text = text.replace(/{nombre_candidato}/g, formData.nombre_candidato);
      text = text.replace(/{años_experiencia}/g, formData.años_experiencia);
      text = text.replace(/{parrafo_experiencia_especifica}/g, paragraph);
      letters[tone] = text;
      console.log(`[CoverLetterGenerator] Substitution done for tone: ${tone}`);
    });

    setGeneratedLetters(letters);
    toast.success('Cartas generadas correctamente');
  };

  const copyToClipboard = (text, tone) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(tone);
    toast.success('Copiado al portapapeles');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const downloadAsPDF = (text, tone) => {
    console.log(`[CoverLetterGenerator] Generating PDF for tone: ${tone}`);
    const element = document.createElement('div');
    element.innerHTML = `<div style="padding: 40px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11pt; color: #333; line-height: 1.6; white-space: pre-wrap;">${text}</div>`;
    
    const opt = {
      margin: 10,
      filename: `Carta_Presentacion_${formData.puesto}_${tone}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
    toast.success('Descargando PDF...');
  };

  return (
    <div className="flex flex-col h-full bg-background relative z-50">
      <div className="flex items-center gap-3 p-4 border-b border-border bg-muted/30">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 rounded-full">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="font-bold text-foreground">Generador de Cartas</h2>
          <p className="text-xs text-muted-foreground">Destaca tu perfil con una carta personalizada</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
        {!generatedLetters ? (
          <form onSubmit={handleGenerate} className="space-y-5 animate-fade-in max-w-lg mx-auto pb-10">
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl mb-6">
              <p className="text-sm text-foreground/80 flex items-start gap-2">
                <PenTool className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                Introduce los datos básicos de la oferta y tu perfil. Generaremos 3 versiones con distintos tonos.
              </p>
            </div>

            <div className="space-y-2 border-b border-border pb-4">
              <Label htmlFor="oferta_id" className="text-muted-foreground">Opcional: ID de la Oferta (Autocompletar)</Label>
              <div className="flex gap-2">
                <Input 
                  id="oferta_id" 
                  placeholder="ID de oferta en FITJOB..." 
                  value={formData.oferta_id}
                  onChange={e => setFormData({...formData, oferta_id: e.target.value})}
                />
                <Button type="button" variant="secondary" onClick={loadOfferData} disabled={!formData.oferta_id || isLoadingOffer}>
                  <Search className="w-4 h-4 mr-2" />
                  Cargar
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="empresa">Empresa objetivo *</Label>
              <Input 
                id="empresa" 
                placeholder="Ej. Mercadona, Hotel Ritz..." 
                value={formData.empresa}
                onChange={e => setFormData({...formData, empresa: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="puesto">Puesto al que aplicas *</Label>
              <Input 
                id="puesto" 
                placeholder="Ej. Camarero/a, Administrativo/a..." 
                value={formData.puesto}
                onChange={e => setFormData({...formData, puesto: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sector">Sector *</Label>
              <Select value={formData.sector} onValueChange={(val) => setFormData({...formData, sector: val})} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un sector" />
                </SelectTrigger>
                <SelectContent zIndex={99999}>
                  {Object.keys(CV_KEYWORDS_BY_SECTOR).map(key => (
                    <SelectItem key={key} value={key} className="capitalize">
                      {key}
                    </SelectItem>
                  ))}
                  <SelectItem value="otros">Otros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre_candidato">Tu Nombre *</Label>
                <Input 
                  id="nombre_candidato" 
                  value={formData.nombre_candidato}
                  onChange={e => setFormData({...formData, nombre_candidato: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="años_experiencia">Años experiencia</Label>
                <Input 
                  id="años_experiencia" 
                  placeholder="Ej. 3 años..." 
                  value={formData.años_experiencia}
                  onChange={e => setFormData({...formData, años_experiencia: e.target.value})}
                />
              </div>
            </div>

            <Button type="submit" className="w-full mt-4">
              Generar Cartas de Presentación
            </Button>
          </form>
        ) : (
          <div className="space-y-6 animate-fade-in max-w-2xl mx-auto pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2 bg-card p-4 rounded-xl border shadow-sm">
              <div>
                <h3 className="font-bold text-lg">Tus cartas están listas</h3>
                <p className="text-xs text-muted-foreground">
                  Esta es una plantilla profesional. Revísala y ajústala antes de enviarla.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setGeneratedLetters(null)}>
                <RefreshCw className="w-4 h-4 mr-2" /> Rehacer
              </Button>
            </div>

            <Tabs defaultValue="formal" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                {TONE_VARIANTS.map(variant => (
                  <TabsTrigger key={variant.id} value={variant.id}>
                    {variant.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {TONE_VARIANTS.map(variant => (
                <TabsContent key={variant.id} value={variant.id} className="space-y-4">
                  <div className="bg-muted/40 border rounded-lg p-3">
                    <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
                      {variant.description}
                    </p>
                  </div>
                  
                  <div className="relative group">
                    <Textarea 
                      value={generatedLetters[variant.id]} 
                      readOnly 
                      className="min-h-[350px] text-sm leading-relaxed resize-none bg-card p-5 focus-visible:ring-1"
                    />
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => downloadAsPDF(generatedLetters[variant.id], variant.id)}
                        className="shadow-sm opacity-90 hover:opacity-100"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        PDF
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => copyToClipboard(generatedLetters[variant.id], variant.id)}
                        className="shadow-sm"
                      >
                        {copiedIndex === variant.id ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                        {copiedIndex === variant.id ? 'Copiado' : 'Copiar'}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoverLetterGenerator;