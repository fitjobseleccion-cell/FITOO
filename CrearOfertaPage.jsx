import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Briefcase, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import pb from '@/lib/pocketbaseClient';

const CrearOfertaPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    titulo: '',
    puesto: '',
    descripcion: '',
    ubicacion: '',
    ciudad: '',
    provincia: '',
    contrato: '',
    jornada: '',
    requisitos: '',
    funciones: '',
    beneficios: '',
    experiencia_minima: '',
    salario_minimo: '',
    salario_maximo: '',
    modalidad: '',
    fecha_incorporacion: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!pb.authStore.isValid) {
      return toast.error('Debes iniciar sesión para publicar una oferta');
    }

    if (!formData.titulo.trim()) return toast.error('El título es obligatorio');
    if (!formData.puesto.trim()) return toast.error('El puesto es obligatorio');
    if (!formData.descripcion.trim()) return toast.error('La descripción es obligatoria');
    if (!formData.ubicacion.trim()) return toast.error('La ubicación es obligatoria');
    if (!formData.ciudad.trim()) return toast.error('La ciudad es obligatoria');
    if (!formData.provincia.trim()) return toast.error('La provincia es obligatoria');
    if (!formData.contrato) return toast.error('Selecciona un tipo de contrato');
    if (!formData.jornada) return toast.error('Selecciona un tipo de jornada');

    setIsSubmitting(true);

    try {
      const user = pb.authStore.model;
      
      const payload = {
        titulo: formData.titulo,
        puesto: formData.puesto,
        descripcion: formData.descripcion,
        ubicacion: formData.ubicacion,
        ciudad: formData.ciudad,
        provincia: formData.provincia,
        empresa: user.name || 'Empresa Confidencial',
        salario_minimo: formData.salario_minimo ? parseFloat(formData.salario_minimo) : null,
        salario_maximo: formData.salario_maximo ? parseFloat(formData.salario_maximo) : null,
        tipo_contrato: formData.contrato,
        jornada: formData.jornada,
        requisitos: formData.requisitos,
        funciones: formData.funciones,
        beneficios: formData.beneficios,
        modalidad: formData.modalidad || 'Presencial',
        fecha_incorporacion: formData.fecha_incorporacion || null,
        estado: 'publicada',
        admin_id: user.id
      };

      await pb.collection('ofertas').create(payload, { $autoCancel: false });

      toast.success('Oferta publicada ✓');
      navigate('/panel-empresa');
    } catch (error) {
      console.error('Create offer error:', error);
      toast.error('Error al guardar la oferta: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Crear Oferta | FITJOB</title>
      </Helmet>

      <div className="min-h-screen bg-muted/20 py-24">
        <div className="container max-w-4xl">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/panel-empresa')}
            className="mb-6 pl-0 hover:bg-transparent hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al panel
          </Button>

          <div className="bg-card rounded-2xl shadow-sm border p-8 md:p-10">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Crear nueva oferta</h1>
                <p className="text-muted-foreground text-sm">Completa los detalles para publicar tu vacante</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-lg font-semibold border-b pb-2">Información Principal</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="titulo">Título de la oferta *</Label>
                    <Input 
                      id="titulo" 
                      name="titulo" 
                      value={formData.titulo}
                      onChange={handleInputChange}
                      placeholder="Ej: Buscamos Desarrollador Frontend"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="puesto">Puesto *</Label>
                    <Input 
                      id="puesto" 
                      name="puesto" 
                      value={formData.puesto}
                      onChange={handleInputChange}
                      placeholder="Ej: Desarrollador Frontend Senior"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="ubicacion">Ubicación completa *</Label>
                    <Input 
                      id="ubicacion" 
                      name="ubicacion" 
                      value={formData.ubicacion}
                      onChange={handleInputChange}
                      placeholder="Ej: Calle Mayor 1, Madrid"
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
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-lg font-semibold border-b pb-2">Condiciones</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>Tipo de contrato *</Label>
                    <Select value={formData.contrato} onValueChange={(val) => handleSelectChange('contrato', val)} disabled={isSubmitting}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona contrato" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="indefinido">Indefinido</SelectItem>
                        <SelectItem value="temporal">Temporal</SelectItem>
                        <SelectItem value="prácticas">Prácticas</SelectItem>
                        <SelectItem value="autónomo">Autónomo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Jornada *</Label>
                    <Select value={formData.jornada} onValueChange={(val) => handleSelectChange('jornada', val)} disabled={isSubmitting}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona jornada" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="completa">Completa</SelectItem>
                        <SelectItem value="media">Media</SelectItem>
                        <SelectItem value="por horas">Por horas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Modalidad</Label>
                    <Select value={formData.modalidad} onValueChange={(val) => handleSelectChange('modalidad', val)} disabled={isSubmitting}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona modalidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Presencial">Presencial</SelectItem>
                        <SelectItem value="Remoto">Remoto</SelectItem>
                        <SelectItem value="Híbrido">Híbrido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="salario_minimo">Salario Mínimo (€/año)</Label>
                    <Input 
                      id="salario_minimo" 
                      name="salario_minimo" 
                      type="number"
                      value={formData.salario_minimo}
                      onChange={handleInputChange}
                      placeholder="Ej: 30000"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salario_maximo">Salario Máximo (€/año)</Label>
                    <Input 
                      id="salario_maximo" 
                      name="salario_maximo" 
                      type="number"
                      value={formData.salario_maximo}
                      onChange={handleInputChange}
                      placeholder="Ej: 40000"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-lg font-semibold border-b pb-2">Detalles del Puesto</h2>
                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción del puesto *</Label>
                  <Textarea 
                    id="descripcion" 
                    name="descripcion" 
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    placeholder="Describe las responsabilidades y el día a día..."
                    className="min-h-[120px]"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="funciones">Funciones</Label>
                  <Textarea 
                    id="funciones" 
                    name="funciones" 
                    value={formData.funciones}
                    onChange={handleInputChange}
                    placeholder="Lista de tareas específicas..."
                    className="min-h-[100px]"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requisitos">Requisitos</Label>
                  <Textarea 
                    id="requisitos" 
                    name="requisitos" 
                    value={formData.requisitos}
                    onChange={handleInputChange}
                    placeholder="Estudios, conocimientos específicos..."
                    className="min-h-[100px]"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="beneficios">Beneficios</Label>
                  <Textarea 
                    id="beneficios" 
                    name="beneficios" 
                    value={formData.beneficios}
                    onChange={handleInputChange}
                    placeholder="Seguro médico, gimnasio, formación..."
                    className="min-h-[100px]"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="pt-6 border-t">
                <Button 
                  type="submit" 
                  className="w-full md:w-auto px-8 h-12 text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Publicando...
                    </>
                  ) : (
                    'Publicar Oferta'
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

export default CrearOfertaPage;