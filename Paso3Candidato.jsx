import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Paso3Candidato = ({ formData, updateData, errors }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-foreground mb-2">Perfil del Candidato</h3>
        <p className="text-muted-foreground">Defina las características, habilidades y requisitos del candidato ideal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Experiencia mínima */}
        <div className="space-y-2">
          <Label htmlFor="candidato_experiencia_minima">Experiencia mínima requerida</Label>
          <Select 
            value={formData.candidato_experiencia_minima || ''} 
            onValueChange={(val) => updateData('candidato_experiencia_minima', val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Años de experiencia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sin experiencia">Sin experiencia requerida</SelectItem>
              <SelectItem value="Menos de 1 año">Menos de 1 año</SelectItem>
              <SelectItem value="1 a 3 años">De 1 a 3 años</SelectItem>
              <SelectItem value="3 a 5 años">De 3 a 5 años</SelectItem>
              <SelectItem value="Más de 5 años">Más de 5 años</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tipo de servicio */}
        <div className="space-y-2">
          <Label htmlFor="candidato_tipo_servicio">Tipo de servicio a prestar</Label>
          <Input 
            id="candidato_tipo_servicio" 
            placeholder="Ej: Atención al cliente B2B" 
            value={formData.candidato_tipo_servicio || ''} 
            onChange={(e) => updateData('candidato_tipo_servicio', e.target.value)}
          />
        </div>

        {/* Ritmo de trabajo */}
        <div className="space-y-2">
          <Label htmlFor="candidato_ritmo_trabajo">Ritmo de trabajo esperado</Label>
          <Select 
            value={formData.candidato_ritmo_trabajo || ''} 
            onValueChange={(val) => updateData('candidato_ritmo_trabajo', val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione ritmo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Intenso">Intenso / Alta presión</SelectItem>
              <SelectItem value="Moderado">Moderado / Dinámico</SelectItem>
              <SelectItem value="Tranquilo">Tranquilo / Pausado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tipo de turno */}
        <div className="space-y-2">
          <Label htmlFor="candidato_tipo_turno">Tipo de turnos</Label>
          <Select 
            value={formData.candidato_tipo_turno || ''} 
            onValueChange={(val) => updateData('candidato_tipo_turno', val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione turnos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Turno fijo de mañana">Turno fijo de mañana</SelectItem>
              <SelectItem value="Turno fijo de tarde">Turno fijo de tarde</SelectItem>
              <SelectItem value="Turno fijo de noche">Turno fijo de noche</SelectItem>
              <SelectItem value="Turnos rotativos">Turnos rotativos</SelectItem>
              <SelectItem value="Turno partido">Turno partido</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Fines de semana */}
        <div className="space-y-2">
          <Label htmlFor="candidato_fines_semana">¿Deberá trabajar fines de semana?</Label>
          <Select 
            value={formData.candidato_fines_semana || ''} 
            onValueChange={(val) => updateData('candidato_fines_semana', val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sí">Sí</SelectItem>
              <SelectItem value="No">No</SelectItem>
              <SelectItem value="Ocasionalmente">Ocasionalmente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Habilidades */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="candidato_habilidades">Habilidades y conocimientos requeridos</Label>
          <Textarea 
            id="candidato_habilidades" 
            placeholder="Mencione herramientas, lenguajes, o aptitudes clave..." 
            className="min-h-[80px]"
            value={formData.candidato_habilidades || ''} 
            onChange={(e) => updateData('candidato_habilidades', e.target.value)}
          />
        </div>

        <div className="col-span-1 md:col-span-2 mt-4">
          <h4 className="font-semibold text-lg border-b border-border pb-2 mb-4">Pruebas y Evaluación</h4>
        </div>

        {/* Prueba práctica */}
        <div className="space-y-2">
          <Label htmlFor="candidato_prueba_practica">¿Se requiere prueba práctica previa?</Label>
          <Select 
            value={formData.candidato_prueba_practica || ''} 
            onValueChange={(val) => updateData('candidato_prueba_practica', val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sí">Sí</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Prueba remunerada */}
        <div className="space-y-2">
          <Label htmlFor="candidato_prueba_remunerada">¿El periodo de prueba o la prueba técnica será remunerada?</Label>
          <Select 
            value={formData.candidato_prueba_remunerada || ''} 
            onValueChange={(val) => updateData('candidato_prueba_remunerada', val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sí">Sí</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-1 md:col-span-2 mt-4">
          <h4 className="font-semibold text-lg border-b border-border pb-2 mb-4">Funciones e Incentivos</h4>
        </div>

        {/* Descripción de funciones */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="candidato_descripcion_funciones">Descripción detallada de funciones</Label>
          <Textarea 
            id="candidato_descripcion_funciones" 
            placeholder="Describa el día a día del candidato en este puesto..." 
            className="min-h-[100px]"
            value={formData.candidato_descripcion_funciones || ''} 
            onChange={(e) => updateData('candidato_descripcion_funciones', e.target.value)}
          />
        </div>

        {/* Incentivos */}
        <div className="space-y-2">
          <Label htmlFor="candidato_incentivos">¿Ofrece comisiones o incentivos?</Label>
          <Select 
            value={formData.candidato_incentivos || ''} 
            onValueChange={(val) => updateData('candidato_incentivos', val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sí">Sí</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Detalles de incentivos */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="candidato_detalles_incentivos">Detalles de incentivos (si aplica)</Label>
          <Textarea 
            id="candidato_detalles_incentivos" 
            placeholder="Describa el modelo de comisiones, bonos por objetivos, etc." 
            className="min-h-[80px]"
            value={formData.candidato_detalles_incentivos || ''} 
            onChange={(e) => updateData('candidato_detalles_incentivos', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Paso3Candidato;