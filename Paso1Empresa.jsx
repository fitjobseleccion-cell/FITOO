import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Paso1Empresa = ({ formData, updateData, errors }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-foreground mb-2">Datos de la Empresa</h3>
        <p className="text-muted-foreground">Proporcione la información básica sobre su empresa para que podamos conocerle mejor.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre de empresa */}
        <div className="space-y-2">
          <Label htmlFor="empresa_nombre">Nombre comercial de la empresa <span className="text-destructive">*</span></Label>
          <Input 
            id="empresa_nombre" 
            placeholder="Ej: TechCorp" 
            value={formData.empresa_nombre || ''} 
            onChange={(e) => updateData('empresa_nombre', e.target.value)}
            className={errors.empresa_nombre ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {errors.empresa_nombre && <p className="text-sm text-destructive mt-1.5 font-medium">{errors.empresa_nombre}</p>}
        </div>

        {/* Nombre legal */}
        <div className="space-y-2">
          <Label htmlFor="empresa_nombre_legal">Razón social (Nombre legal)</Label>
          <Input 
            id="empresa_nombre_legal" 
            placeholder="Ej: TechCorp Solutions S.L." 
            value={formData.empresa_nombre_legal || ''} 
            onChange={(e) => updateData('empresa_nombre_legal', e.target.value)}
          />
        </div>

        {/* CIF */}
        <div className="space-y-2">
          <Label htmlFor="empresa_cif">CIF / NIF</Label>
          <Input 
            id="empresa_cif" 
            placeholder="Ej: B12345678" 
            value={formData.empresa_cif || ''} 
            onChange={(e) => updateData('empresa_cif', e.target.value)}
          />
        </div>

        {/* Tipo de negocio */}
        <div className="space-y-2">
          <Label htmlFor="empresa_tipo_negocio">Tipo de negocio / Actividad</Label>
          <Input 
            id="empresa_tipo_negocio" 
            placeholder="Ej: Desarrollo de software" 
            value={formData.empresa_tipo_negocio || ''} 
            onChange={(e) => updateData('empresa_tipo_negocio', e.target.value)}
          />
        </div>

        {/* Sector (Existing) */}
        <div className="space-y-2">
          <Label htmlFor="empresa_sector">Sector corporativo</Label>
          <Select 
            value={formData.empresa_sector || ''} 
            onValueChange={(val) => updateData('empresa_sector', val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un sector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tecnología e Informática">Tecnología e Informática</SelectItem>
              <SelectItem value="Hostelería y Turismo">Hostelería y Turismo</SelectItem>
              <SelectItem value="Comercio y Ventas">Comercio y Ventas</SelectItem>
              <SelectItem value="Construcción">Construcción</SelectItem>
              <SelectItem value="Salud y Sanidad">Salud y Sanidad</SelectItem>
              <SelectItem value="Logística y Transporte">Logística y Transporte</SelectItem>
              <SelectItem value="Educación">Educación</SelectItem>
              <SelectItem value="Industria">Industria</SelectItem>
              <SelectItem value="Otro">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tamaño (Existing) */}
        <div className="space-y-2">
          <Label htmlFor="empresa_tamano">Tamaño de la empresa</Label>
          <Select 
            value={formData.empresa_tamano || ''} 
            onValueChange={(val) => updateData('empresa_tamano', val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Número de empleados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-10 empleados">1-10 empleados</SelectItem>
              <SelectItem value="11-50 empleados">11-50 empleados</SelectItem>
              <SelectItem value="51-200 empleados">51-200 empleados</SelectItem>
              <SelectItem value="201-500 empleados">201-500 empleados</SelectItem>
              <SelectItem value="Más de 500 empleados">Más de 500 empleados</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Domicilio */}
        <div className="space-y-2">
          <Label htmlFor="empresa_domicilio">Domicilio fiscal</Label>
          <Input 
            id="empresa_domicilio" 
            placeholder="Ej: Calle Principal 123, 1ºA" 
            value={formData.empresa_domicilio || ''} 
            onChange={(e) => updateData('empresa_domicilio', e.target.value)}
          />
        </div>

        {/* Ciudad */}
        <div className="space-y-2">
          <Label htmlFor="empresa_ciudad">Ciudad</Label>
          <Input 
            id="empresa_ciudad" 
            placeholder="Ej: Madrid" 
            value={formData.empresa_ciudad || ''} 
            onChange={(e) => updateData('empresa_ciudad', e.target.value)}
          />
        </div>

        {/* Ubicación (Existing) */}
        <div className="space-y-2">
          <Label htmlFor="empresa_ubicacion">Sede / Ubicación principal</Label>
          <Input 
            id="empresa_ubicacion" 
            placeholder="Ej: Madrid, España" 
            value={formData.empresa_ubicacion || ''} 
            onChange={(e) => updateData('empresa_ubicacion', e.target.value)}
          />
        </div>

        <div className="col-span-1 md:col-span-2 mt-4">
          <h4 className="font-semibold text-lg border-b border-border pb-2 mb-4">Datos de Contacto del Representante</h4>
        </div>

        {/* Representante Nombre */}
        <div className="space-y-2">
          <Label htmlFor="empresa_representante_nombre">Nombre del representante</Label>
          <Input 
            id="empresa_representante_nombre" 
            placeholder="Ej: Ana García" 
            value={formData.empresa_representante_nombre || ''} 
            onChange={(e) => updateData('empresa_representante_nombre', e.target.value)}
          />
        </div>

        {/* Representante Cargo */}
        <div className="space-y-2">
          <Label htmlFor="empresa_representante_cargo">Cargo del representante</Label>
          <Input 
            id="empresa_representante_cargo" 
            placeholder="Ej: Directora de RRHH" 
            value={formData.empresa_representante_cargo || ''} 
            onChange={(e) => updateData('empresa_representante_cargo', e.target.value)}
          />
        </div>

        {/* Email de empresa */}
        <div className="space-y-2">
          <Label htmlFor="empresa_email">Email de contacto <span className="text-destructive">*</span></Label>
          <Input 
            id="empresa_email" 
            type="email" 
            placeholder="Ej: rrhh@empresa.com" 
            value={formData.empresa_email || ''} 
            onChange={(e) => updateData('empresa_email', e.target.value)}
            className={errors.empresa_email ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {errors.empresa_email && <p className="text-sm text-destructive mt-1.5 font-medium">{errors.empresa_email}</p>}
        </div>

        {/* Teléfono */}
        <div className="space-y-2">
          <Label htmlFor="empresa_telefono">Teléfono de contacto <span className="text-destructive">*</span></Label>
          <Input 
            id="empresa_telefono" 
            type="tel" 
            placeholder="Ej: +34 600 123 456" 
            value={formData.empresa_telefono || ''} 
            onChange={(e) => updateData('empresa_telefono', e.target.value)}
            className={errors.empresa_telefono ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {errors.empresa_telefono && <p className="text-sm text-destructive mt-1.5 font-medium">{errors.empresa_telefono}</p>}
        </div>
      </div>
    </div>
  );
};

export default Paso1Empresa;