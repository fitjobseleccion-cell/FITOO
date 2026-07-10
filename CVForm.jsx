import React, { useRef } from 'react';
import { Plus, Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function CVForm({ data, onChange, onPhotoUpload }) {
  const fileInputRef = useRef(null);

  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  const handleArrayChange = (field, index, subfield, value) => {
    const newArray = [...data[field]];
    newArray[index] = { ...newArray[index], [subfield]: value };
    onChange({ [field]: newArray });
  };

  const addArrayItem = (field, newItem) => {
    onChange({ [field]: [...data[field], { id: Date.now().toString(), ...newItem }] });
  };

  const removeArrayItem = (field, index) => {
    const newArray = data[field].filter((_, i) => i !== index);
    onChange({ [field]: newArray });
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      await onPhotoUpload(file);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* DATOS PERSONALES */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Datos Personales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="flex flex-col items-center gap-2">
              <div className="w-24 h-24 rounded-2xl bg-muted border-2 border-dashed flex items-center justify-center overflow-hidden relative group">
                {data.photo ? (
                  <>
                    <img src={data.photo} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="ghost" size="icon" className="text-white hover:text-white" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="w-5 h-5" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-2 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <ImageIcon className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Subir Foto</span>
                  </div>
                )}
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} />
              {data.photo && (
                <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive" onClick={() => onChange({ photo: null })}>
                  Eliminar foto
                </Button>
              )}
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div className="space-y-1.5">
                <Label htmlFor="nombre">Nombre</Label>
                <Input id="nombre" value={data.nombre} onChange={(e) => handleChange('nombre', e.target.value)} placeholder="Ej. Ana" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="apellidos">Apellidos</Label>
                <Input id="apellidos" value={data.apellidos} onChange={(e) => handleChange('apellidos', e.target.value)} placeholder="Ej. García López" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="puesto">Puesto Deseado</Label>
                <Input id="puesto" value={data.puesto} onChange={(e) => handleChange('puesto', e.target.value)} placeholder="Ej. Desarrollador Frontend Senior" />
              </div>
            </div>
          </div>

          <Separator />
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input id="telefono" value={data.telefono} onChange={(e) => handleChange('telefono', e.target.value)} placeholder="+34 600 000 000" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={data.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="ana@ejemplo.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ciudad">Ciudad</Label>
              <Input id="ciudad" value={data.ciudad} onChange={(e) => handleChange('ciudad', e.target.value)} placeholder="Madrid, España" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PERFIL */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Perfil y Habilidades</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-1.5">
            <Label htmlFor="sobreMi">Sobre Mí</Label>
            <Textarea 
              id="sobreMi" 
              rows={4}
              value={data.sobreMi} 
              onChange={(e) => handleChange('sobreMi', e.target.value)} 
              placeholder="Escribe un breve resumen profesional..." 
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="aptitudes">Aptitudes Técnicas (separadas por comas)</Label>
            <Input 
              id="aptitudes" 
              value={data.aptitudes} 
              onChange={(e) => handleChange('aptitudes', e.target.value)} 
              placeholder="Ej. React, Node.js, Excel, Python" 
            />
            <p className="text-xs text-muted-foreground mt-1">Generará iconos de colores automáticamente en el CV.</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="habilidades">Habilidades Personales (separadas por comas)</Label>
            <Input 
              id="habilidades" 
              value={data.habilidades} 
              onChange={(e) => handleChange('habilidades', e.target.value)} 
              placeholder="Ej. Liderazgo, Trabajo en equipo, Comunicación" 
            />
          </div>
        </CardContent>
      </Card>

      {/* EXPERIENCIA LABORAL */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Experiencia Laboral</CardTitle>
          <Button variant="outline" size="sm" onClick={() => addArrayItem('experiencia', { empresa: '', puesto: '', fechaInicio: '', fechaFin: '', funciones: '' })}>
            <Plus className="w-4 h-4 mr-1.5" /> Añadir
          </Button>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          {data.experiencia.map((exp, index) => (
            <div key={exp.id} className="relative bg-muted/30 p-4 rounded-xl border">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                onClick={() => removeArrayItem('experiencia', index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-8">
                <div className="space-y-1.5">
                  <Label>Empresa</Label>
                  <Input value={exp.empresa} onChange={(e) => handleArrayChange('experiencia', index, 'empresa', e.target.value)} placeholder="Nombre de la empresa" />
                </div>
                <div className="space-y-1.5">
                  <Label>Puesto</Label>
                  <Input value={exp.puesto} onChange={(e) => handleArrayChange('experiencia', index, 'puesto', e.target.value)} placeholder="Tu cargo" />
                </div>
                <div className="space-y-1.5">
                  <Label>Fecha Inicio</Label>
                  <Input value={exp.fechaInicio} onChange={(e) => handleArrayChange('experiencia', index, 'fechaInicio', e.target.value)} placeholder="Ej. Ene 2020" />
                </div>
                <div className="space-y-1.5">
                  <Label>Fecha Fin</Label>
                  <Input value={exp.fechaFin} onChange={(e) => handleArrayChange('experiencia', index, 'fechaFin', e.target.value)} placeholder="Ej. Actualidad" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Funciones y Logros</Label>
                  <Textarea rows={3} value={exp.funciones} onChange={(e) => handleArrayChange('experiencia', index, 'funciones', e.target.value)} placeholder="Describe tus responsabilidades principales..." />
                </div>
              </div>
            </div>
          ))}
          {data.experiencia.length === 0 && (
            <div className="text-center text-muted-foreground text-sm py-4">No has añadido experiencia.</div>
          )}
        </CardContent>
      </Card>

      {/* EDUCACION */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Educación</CardTitle>
          <Button variant="outline" size="sm" onClick={() => addArrayItem('educacion', { centro: '', titulacion: '', fechaInicio: '', fechaFin: '' })}>
            <Plus className="w-4 h-4 mr-1.5" /> Añadir
          </Button>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          {data.educacion.map((edu, index) => (
            <div key={edu.id} className="relative bg-muted/30 p-4 rounded-xl border">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                onClick={() => removeArrayItem('educacion', index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-8">
                <div className="space-y-1.5">
                  <Label>Centro / Institución</Label>
                  <Input value={edu.centro} onChange={(e) => handleArrayChange('educacion', index, 'centro', e.target.value)} placeholder="Universidad o centro de estudios" />
                </div>
                <div className="space-y-1.5">
                  <Label>Titulación</Label>
                  <Input value={edu.titulacion} onChange={(e) => handleArrayChange('educacion', index, 'titulacion', e.target.value)} placeholder="Ej. Grado en Informática" />
                </div>
                <div className="space-y-1.5">
                  <Label>Fecha Inicio</Label>
                  <Input value={edu.fechaInicio} onChange={(e) => handleArrayChange('educacion', index, 'fechaInicio', e.target.value)} placeholder="Ej. Sep 2015" />
                </div>
                <div className="space-y-1.5">
                  <Label>Fecha Fin / Graduación</Label>
                  <Input value={edu.fechaFin} onChange={(e) => handleArrayChange('educacion', index, 'fechaFin', e.target.value)} placeholder="Ej. Jun 2019" />
                </div>
              </div>
            </div>
          ))}
          {data.educacion.length === 0 && (
            <div className="text-center text-muted-foreground text-sm py-4">No has añadido educación.</div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}