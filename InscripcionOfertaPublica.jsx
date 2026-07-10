import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, UploadCloud, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import pb from '@/lib/pocketbaseClient';

const InscripcionOfertaPublica = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [oferta, setOferta] = useState(null);
  const [fileName, setFileName] = useState('');
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    ciudad: '',
    provincia: '',
    fecha_nacimiento: '',
    permiso_trabajo: '',
    curriculum: null
  });

  useEffect(() => {
    const fetchOferta = async () => {
      try {
        const record = await pb.collection('ofertas').getOne(id, { $autoCancel: false });
        setOferta(record);
      } catch (err) {
        console.error('Oferta no encontrada', err);
        navigate('/ofertas-de-trabajo');
      }
    };
    fetchOferta();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setFormData(prev => ({ ...prev, curriculum: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) return toast.error('El nombre es obligatorio');
    if (!formData.apellidos.trim()) return toast.error('Los apellidos son obligatorios');
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) return toast.error('Email inválido');
    if (!formData.telefono.trim() || formData.telefono.replace(/\D/g, '').length < 9) return toast.error('Teléfono inválido (mínimo 9 dígitos)');
    if (!formData.ciudad.trim()) return toast.error('La ciudad es obligatoria');
    if (!formData.provincia.trim()) return toast.error('La provincia es obligatoria');
    if (!formData.fecha_nacimiento) return toast.error('La fecha de nacimiento es obligatoria');
    if (!formData.permiso_trabajo) return toast.error('Debes indicar si tienes permiso de trabajo');
    if (!formData.curriculum) return toast.error('Debes adjuntar tu currículum');

    setIsSubmitting(true);

    try {
      const candidateData = new FormData();
      candidateData.append('nombre', formData.nombre);
      candidateData.append('apellidos', formData.apellidos);
      candidateData.append('email', formData.email);
      candidateData.append('telefono', formData.telefono);
      candidateData.append('ciudad', formData.ciudad);
      candidateData.append('provincia', formData.provincia);
      
      const dateObj = new Date(formData.fecha_nacimiento);
      candidateData.append('fecha_nacimiento', dateObj.toISOString());
      
      candidateData.append('permiso_trabajo', formData.permiso_trabajo);
      candidateData.append('estado_candidatura', 'recibido');
      candidateData.append('oferta_id', id);
      
      if (formData.curriculum instanceof File) {
        candidateData.append('curriculum', formData.curriculum);
      }

      if (pb.authStore.isValid) {
        candidateData.append('usuario_id', pb.authStore.model.id);
      }

      await pb.collection('candidatos').create(candidateData, { $autoCancel: false });

      toast.success('Inscripción completada ✓');
      navigate('/ofertas-de-trabajo');
      
    } catch (error) {
      console.error('Error in public inscription:', error);
      toast.error('Error al procesar la inscripción: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!oferta) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Inscribirse en {oferta.titulo} | FITJOB</title>
      </Helmet>

      <div className="min-h-screen bg-muted/20 py-24">
        <div className="container max-w-3xl">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/ofertas-de-trabajo/${id}`)}
            className="mb-6 pl-0 hover:bg-transparent hover:text-primary"
            disabled={isSubmitting}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a la oferta
          </Button>

          <div className="bg-card p-8 md:p-10 rounded-3xl shadow-sm border">
            <div className="mb-8 pb-6 border-b">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Formulario de Candidatura</h1>
              <p className="text-muted-foreground">Estás aplicando para: <span className="font-semibold text-foreground">{oferta.titulo}</span></p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input 
                    id="nombre" 
                    name="nombre" 
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Ej: Laura"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apellidos">Apellidos *</Label>
                  <Input 
                    id="apellidos" 
                    name="apellidos" 
                    value={formData.apellidos}
                    onChange={handleInputChange}
                    placeholder="Ej: García López"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico *</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="laura@ejemplo.com"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono *</Label>
                  <Input 
                    id="telefono" 
                    name="telefono" 
                    type="tel"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="600 000 000"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ciudad">Ciudad *</Label>
                  <Input 
                    id="ciudad" 
                    name="ciudad" 
                    value={formData.ciudad}
                    onChange={handleInputChange}
                    placeholder="Ej: Madrid"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provincia">Provincia *</Label>
                  <Input 
                    id="provincia" 
                    name="provincia" 
                    value={formData.provincia}
                    onChange={handleInputChange}
                    placeholder="Ej: Madrid"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fecha_nacimiento">Fecha de nacimiento *</Label>
                  <Input 
                    id="fecha_nacimiento" 
                    name="fecha_nacimiento" 
                    type="date"
                    value={formData.fecha_nacimiento}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Permiso de trabajo en España *</Label>
                  <Select value={formData.permiso_trabajo} onValueChange={(val) => handleSelectChange('permiso_trabajo', val)} disabled={isSubmitting}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una opción" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sí">Sí</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Currículum Vitae (PDF) *</Label>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center bg-muted/10 transition-colors hover:bg-muted/30">
                    <UploadCloud className="w-10 h-10 text-muted-foreground mb-4" />
                    <p className="text-sm font-medium mb-1 text-foreground">
                      {fileName ? fileName : 'Haz clic para seleccionar tu CV'}
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">Solo PDF. Máximo 20MB</p>
                    <div className="relative">
                      <Button type="button" variant="secondary" disabled={isSubmitting}>
                        {fileName ? 'Cambiar archivo' : 'Seleccionar archivo'}
                      </Button>
                      <input 
                        type="file" 
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg font-bold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Enviando candidatura...
                    </>
                  ) : (
                    'Enviar Candidatura'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default InscripcionOfertaPublica;