import React from 'react';
import { Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SectionHeader = ({ title, onEdit }) => (
  <div className="flex items-center justify-between border-b border-border pb-2 mb-4 mt-6">
    <h4 className="text-lg font-bold text-foreground">{title}</h4>
    <Button variant="ghost" size="sm" onClick={onEdit} className="text-primary hover:text-primary hover:bg-primary/10 h-8 px-3">
      <Edit2 className="w-4 h-4 mr-2" />
      Editar
    </Button>
  </div>
);

const DataRow = ({ label, value }) => {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  
  const displayValue = Array.isArray(value) ? value.join(', ') : value;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 py-2">
      <span className="text-muted-foreground font-medium sm:col-span-1">{label}</span>
      <span className="text-foreground sm:col-span-2 break-words">{displayValue}</span>
    </div>
  );
};

const formatHorarioForDisplay = (horario) => {
  if (!horario || typeof horario !== 'object') return horario;
  const dayNames = { lunes: 'Lunes', martes: 'Martes', miercoles: 'Miércoles', jueves: 'Jueves', viernes: 'Viernes', sabado: 'Sábado' };
  const filledDays = Object.entries(horario).filter(([_, h]) => h.inicio && h.fin);
  
  if (filledDays.length === 0) return null;
  return filledDays.map(([d, h]) => `${dayNames[d] || d}: ${h.inicio}-${h.fin}`).join(', ');
};

const getMissingFields = (formData) => {
  const requiredFields = {
    empresa_tipo_negocio: 'Tipo de Negocio',
    oferta_vacantes: 'Número de vacantes',
    oferta_tipo_jornada: 'Tipo de jornada',
    candidato_experiencia_minima: 'Experiencia mínima',
    oferta_fecha_incorporacion: 'Fecha de incorporación',
    oferta_sueldo: 'Sueldo aproximado',
    oferta_ubicacion: 'Ubicación de la oferta',
    oferta_tipo_contrato: 'Tipo de contrato',
    empresa_nombre: 'Nombre de la empresa',
    empresa_cif: 'CIF',
    empresa_domicilio: 'Domicilio fiscal',
    oferta_horario: 'Horario',
    empresa_email: 'Email de empresa',
    empresa_telefono: 'Teléfono de empresa',
    empresa_nombre_legal: 'Nombre legal de la empresa',
    empresa_representante_nombre: 'Nombre del representante',
    empresa_representante_cargo: 'Cargo del representante',
    oferta_periodo_prueba: 'Periodo de prueba',
    oferta_urgencia: 'Nivel de urgencia',
    oferta_titulo: 'Título de la oferta',
    oferta_modalidad: 'Modalidad de trabajo',
    candidato_descripcion_funciones: 'Descripción de funciones',
    candidato_tipo_servicio: 'Tipo de servicio',
    candidato_ritmo_trabajo: 'Ritmo de trabajo',
    candidato_habilidades: 'Habilidades',
    candidato_tipo_turno: 'Tipo de turno',
    candidato_fines_semana: 'Fines de semana',
    candidato_prueba_practica: 'Prueba práctica',
    empresa_ciudad: 'Ciudad de la empresa',
    candidato_prueba_remunerada: 'Prueba remunerada'
  };

  const missing = [];
  for (const [key, label] of Object.entries(requiredFields)) {
    if (key === 'oferta_horario') {
      let hasSchedule = false;
      if (typeof formData[key] === 'object' && formData[key] !== null) {
        hasSchedule = Object.values(formData[key]).some(h => h.inicio && h.fin);
      }
      if (!hasSchedule && (!formData[key] || String(formData[key]).trim() === '')) {
        missing.push(label);
      }
    } else {
      if (!formData[key] || String(formData[key]).trim() === '') {
        missing.push(label);
      }
    }
  }
  return missing;
};

const Paso4Revision = ({ formData, goToStep }) => {
  const missingFields = getMissingFields(formData);

  return (
    <div className="space-y-2 animate-fade-in">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-foreground mb-2">Revisión Final</h3>
        <p className="text-muted-foreground">Por favor, revise que todos los datos sean correctos antes de enviar el formulario.</p>
      </div>

      {missingFields.length > 0 && (
        <div style={{ backgroundColor: '#fee2e2', borderLeft: '4px solid #dc2626', padding: '12px', marginBottom: '16px', borderRadius: '4px' }}>
          <p style={{ fontWeight: 'bold', color: '#991b1b', marginBottom: '8px' }}>⚠️ Campos obligatorios incompletos:</p>
          <ul style={{ color: '#991b1b', listStyleType: 'disc', paddingLeft: '20px', fontSize: '14px' }}>
            {missingFields.map((field, idx) => (
              <li key={idx}>{field}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        {/* Empresa */}
        <SectionHeader title="1. Datos de la Empresa" onEdit={() => goToStep(1)} />
        <div className="space-y-1">
          <DataRow label="Nombre Comercial" value={formData.empresa_nombre} />
          <DataRow label="Razón Social" value={formData.empresa_nombre_legal} />
          <DataRow label="CIF" value={formData.empresa_cif} />
          <DataRow label="Tipo de Negocio" value={formData.empresa_tipo_negocio} />
          <DataRow label="Sector" value={formData.empresa_sector} />
          <DataRow label="Tamaño" value={formData.empresa_tamano} />
          <DataRow label="Domicilio Fiscal" value={formData.empresa_domicilio} />
          <DataRow label="Ciudad" value={formData.empresa_ciudad} />
          <DataRow label="Ubicación Sede" value={formData.empresa_ubicacion} />
          <DataRow label="Representante" value={formData.empresa_representante_nombre ? `${formData.empresa_representante_nombre} (${formData.empresa_representante_cargo || 'Sin cargo'})` : null} />
          <DataRow label="Email" value={formData.empresa_email} />
          <DataRow label="Teléfono" value={formData.empresa_telefono} />
        </div>

        {/* Oferta */}
        <SectionHeader title="2. Detalles de la Oferta" onEdit={() => goToStep(2)} />
        <div className="space-y-1">
          <DataRow label="Puesto" value={formData.oferta_titulo} />
          <DataRow label="Vacantes" value={formData.oferta_vacantes} />
          <DataRow label="Fecha Incorporación" value={formData.oferta_fecha_incorporacion} />
          <DataRow label="Urgencia" value={formData.oferta_urgencia} />
          <DataRow label="Tipo de contrato" value={formData.oferta_tipo_contrato} />
          <DataRow label="Duración contrato" value={formData.oferta_duracion_contrato} />
          <DataRow label="Periodo de prueba" value={formData.oferta_periodo_prueba} />
          <DataRow label="Tipo jornada" value={formData.oferta_tipo_jornada} />
          <DataRow label="Horario" value={formatHorarioForDisplay(formData.oferta_horario)} />
          <DataRow label="Días libres" value={formData.oferta_dias_libres} />
          <DataRow label="Modalidad" value={formData.oferta_modalidad} />
          <DataRow label="Ubicación" value={formData.oferta_ubicacion} />
          <DataRow label="Salario mensual (€)" value={formData.oferta_sueldo} />
          
          {formData.oferta_descripcion && (
            <div className="pt-2">
              <span className="text-muted-foreground font-medium block mb-1">Descripción:</span>
              <p className="text-foreground whitespace-pre-wrap bg-muted/30 p-3 rounded-md text-sm border border-border">{formData.oferta_descripcion}</p>
            </div>
          )}
        </div>

        {/* Candidato */}
        <SectionHeader title="3. Perfil del Candidato" onEdit={() => goToStep(3)} />
        <div className="space-y-1">
          <DataRow label="Experiencia Mínima" value={formData.candidato_experiencia_minima} />
          <DataRow label="Tipo Servicio" value={formData.candidato_tipo_servicio} />
          <DataRow label="Ritmo Trabajo" value={formData.candidato_ritmo_trabajo} />
          <DataRow label="Tipo Turnos" value={formData.candidato_tipo_turno} />
          <DataRow label="Fines de Semana" value={formData.candidato_fines_semana} />
          <DataRow label="Prueba Práctica" value={formData.candidato_prueba_practica} />
          <DataRow label="Prueba Remunerada" value={formData.candidato_prueba_remunerada} />
          <DataRow label="Incentivos" value={formData.candidato_incentivos} />
          
          {formData.candidato_habilidades && (
            <div className="pt-2">
              <span className="text-muted-foreground font-medium block mb-1">Habilidades requeridas:</span>
              <p className="text-foreground whitespace-pre-wrap bg-muted/30 p-3 rounded-md text-sm border border-border">{formData.candidato_habilidades}</p>
            </div>
          )}
          {formData.candidato_descripcion_funciones && (
            <div className="pt-2">
              <span className="text-muted-foreground font-medium block mb-1">Funciones detalladas:</span>
              <p className="text-foreground whitespace-pre-wrap bg-muted/30 p-3 rounded-md text-sm border border-border">{formData.candidato_descripcion_funciones}</p>
            </div>
          )}
          {formData.candidato_detalles_incentivos && (
            <div className="pt-2">
              <span className="text-muted-foreground font-medium block mb-1">Detalles incentivos:</span>
              <p className="text-foreground whitespace-pre-wrap bg-muted/30 p-3 rounded-md text-sm border border-border">{formData.candidato_detalles_incentivos}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 bg-accent/30 p-4 rounded-xl border border-accent">
        <p className="text-sm text-foreground/80 text-center">
          Al hacer clic en "Enviar formulario", nuestro equipo recibirá su solicitud y se pondrá en contacto con usted en un plazo máximo de 24-48 horas.
        </p>
      </div>
    </div>
  );
};

export default Paso4Revision;