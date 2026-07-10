import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowRight, Info, Upload, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { calculateCVCompleteness } from '@/lib/dashboardDataFetcher.js';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';

const CVSection = ({ user, cvData, onEditCV }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const completeness = calculateCVCompleteness(cvData);
  
  let progressColor = 'bg-red-500';
  if (completeness >= 50 && completeness < 75) progressColor = 'bg-yellow-500';
  if (completeness >= 75 && completeness < 100) progressColor = 'bg-blue-500';
  if (completeness === 100) progressColor = 'bg-green-500';

  const lastUpdated = cvData?.updated 
    ? new Date(cvData.updated).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Nunca';

  const hasGenerator = !!cvData;
  const hasUpload = !!user?.cv_upload;
  const activeCV = user?.cv_activo || (hasUpload && !hasGenerator ? 'archivo' : 'generador');

  const handleEdit = () => {
    if (onEditCV) onEditCV();
    else navigate('/cv-generator');
  };

  const handleCVUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('cv_upload', file);
      if (!user.cv_activo) {
        formData.append('cv_activo', 'archivo');
      }

      await pb.collection('users').update(user.id, formData, { $autoCancel: false });
      await pb.collection('users').authRefresh({ $autoCancel: false });
      toast.success('CV subido correctamente');
    } catch (err) {
      console.error(err);
      toast.error('Error al subir el CV');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSetCVActivo = async (type) => {
    if (activeCV === type || !user?.id) return;
    try {
      await pb.collection('users').update(user.id, { cv_activo: type }, { $autoCancel: false });
      await pb.collection('users').authRefresh({ $autoCancel: false });
      toast.success(`CV activo actualizado a ${type === 'generador' ? 'Generador' : 'Archivo'}`);
    } catch (err) {
      console.error(err);
      toast.error('Error al cambiar el CV activo');
    }
  };

  const renderGeneratorBlock = () => (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Tu Currículum</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Última actualización: {lastUpdated}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button onClick={handleEdit} className="w-full sm:w-auto">
            {hasGenerator ? 'Editar CV' : 'Crear CV'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          {!hasUpload && (
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="w-full sm:w-auto">
              {isUploading ? 'Subiendo...' : 'O sube tu propio CV'}
              {!isUploading && <Upload className="w-4 h-4 ml-2" />}
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm font-medium">
          <span className="text-foreground">Completado</span>
          <span className={progressColor.replace('bg-', 'text-')}>{completeness}%</span>
        </div>
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ease-out ${progressColor}`}
            style={{ width: `${completeness}%` }}
          />
        </div>
      </div>

      {completeness < 100 && (
        <div className="mt-6 flex gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Un perfil más completo recibe hasta un <strong>40% más de visitas</strong> por parte de los reclutadores. 
            Te recomendamos añadir más experiencia y habilidades.
          </p>
        </div>
      )}
    </>
  );

  const renderUploadBlock = () => {
    const uploadDate = user?.updated 
      ? new Date(user.updated).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
      : 'Desconocida';
      
    return (
      <>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground tracking-tight">Tu Currículum Subido</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Última actualización: {uploadDate}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {user?.cv_upload && (
              <a href={pb.files.getURL(user, user.cv_upload)} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full">
                  Ver tu CV subido
                  <FileText className="w-4 h-4 ml-2" />
                </Button>
              </a>
            )}
            {!hasGenerator && (
              <Button onClick={handleEdit} className="w-full sm:w-auto">
                Crear CV con nuestro generador
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
            <Button variant="secondary" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="w-full sm:w-auto">
              {isUploading ? 'Subiendo...' : 'Actualizar archivo'}
              {!isUploading && <Upload className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </div>
      </>
    );
  };

  return (
    <section className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden p-6 transition-all duration-300">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleCVUpload}
        accept=".pdf,.doc,.docx"
        className="hidden"
      />
      
      {hasGenerator && hasUpload && (
        <div className="flex flex-wrap gap-2 mb-6 p-1 bg-muted/50 rounded-lg w-fit">
          <Button 
            variant={activeCV === 'generador' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleSetCVActivo('generador')}
            className="rounded-md"
          >
            {activeCV === 'generador' && <CheckCircle2 className="w-4 h-4 mr-2" />}
            Usar CV del generador
          </Button>
          <Button 
            variant={activeCV === 'archivo' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleSetCVActivo('archivo')}
            className="rounded-md"
          >
            {activeCV === 'archivo' && <CheckCircle2 className="w-4 h-4 mr-2" />}
            Usar mi archivo subido
          </Button>
        </div>
      )}

      {(!hasGenerator && !hasUpload) || (hasGenerator && !hasUpload) ? (
        renderGeneratorBlock()
      ) : (!hasGenerator && hasUpload) ? (
        renderUploadBlock()
      ) : (
        activeCV === 'generador' ? renderGeneratorBlock() : renderUploadBlock()
      )}
    </section>
  );
};

export default CVSection;