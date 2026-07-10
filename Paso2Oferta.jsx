import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

const generarOpcionesHoras = () => {
  const times = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hh = h.toString().padStart(2, '0');
      const mm = m.toString().padStart(2, '0');
      times.push(`${hh}:${mm}`);
    }
  }
  return times;
};

const timeOptions = generarOpcionesHoras();

const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
const diaLabels = {
  lunes: 'Lunes', martes: 'Martes', miercoles: 'Miércoles',
  jueves: 'Jueves', viernes: 'Viernes', sabado: 'Sábado', domingo: 'Domingo'
};

const defaultHorarios = {
  lunes: { inicio: '09:00', fin: '18:00', libre: false },
  martes: { inicio: '09:00', fin: '18:00', libre: false },
  miercoles: { inicio: '09:00', fin: '18:00', libre: false },
  jueves: { inicio: '09:00', fin: '18:00', libre: false },
  viernes: { inicio: '09:00', fin: '18:00', libre: false },
  sabado: { inicio: '09:00', fin: '18:00', libre: false },
  domingo: { inicio: '09:00', fin: '18:00', libre: false }
};

const parseHorarioString = (str) => {
  if (!str || typeof str !== 'string') {
    if (typeof str === 'object' && str !== null && str.lunes) {
      const parsed = {};
      days.forEach(d => {
        const h = str[d];
        if (h && h.inicio && h.fin) {
          parsed[d] = { inicio: h.inicio, fin: h.fin, libre: false };
        } else {
          parsed[d] = { inicio: '09:00', fin: '18:00', libre: true };
        }
      });
      return parsed;
    }
    return defaultHorarios;
  }
  
  const parsed = { ...defaultHorarios };
  const parts = str.split('; ');
  const diaMapReverse = {
    'Lunes': 'lunes', 'Martes': 'martes', 'Miércoles': 'miercoles',
    'Jueves': 'jueves', 'Viernes': 'viernes', 'Sábado': 'sabado', 'Domingo': 'domingo'
  };
  
  parts.forEach(part => {
    const spaceIndex = part.indexOf(' ');
    if (spaceIndex === -1) return;
    
    const nombreDia = part.substring(0, spaceIndex);
    const horario = part.substring(spaceIndex + 1);
    const diaKey = diaMapReverse[nombreDia];
    
    if (diaKey) {
      if (horario === 'LIBRE') {
        parsed[diaKey] = { inicio: '09:00', fin: '18:00', libre: true };
      } else {
        const [inicio, fin] = horario.split('-');
        parsed[diaKey] = { inicio: inicio || '09:00', fin: fin || '18:00', libre: false };
      }
    }
  });
  
  return parsed;
};

const Paso2Oferta = ({ formData, updateData, errors }) => {
  const [mismoHorarioTodos, setMismoHorarioTodos] = useState(false);
  const [horariosPorDia, setHorariosPorDia] = useState(() => parseHorarioString(formData.oferta_horario));

  const convertirHorarioAString = (horarios) => {
    return days.map(diaKey => {
      const datos = horarios[diaKey];
      if (datos.libre) return `${diaLabels[diaKey]} LIBRE`;
      return `${diaLabels[diaKey]} ${datos.inicio}-${datos.fin}`;
    }).join('; ');
  };

  useEffect(() => {
    const formatString = convertirHorarioAString(horariosPorDia);
    if (formData.oferta_horario !== formatString) {
      updateData('oferta_horario', formatString);
    }
  }, [horariosPorDia]); // eslint-disable-line react-hooks/exhaustive-deps

  const copiarHorarioATodos = (diaOrigen) => {
    const origen = horariosPorDia[diaOrigen];
    setHorariosPorDia(prev => {
      const nuevoHorario = { ...prev };
      days.forEach(dia => {
        nuevoHorario[dia] = { ...origen };
      });
      return nuevoHorario;
    });
  };

  const handleMismoHorarioChange = (checked) => {
    setMismoHorarioTodos(checked);
    if (checked) {
      copiarHorarioATodos('lunes');
    }
  };

  const handleTimeChange = (dia, campo, valor) => {
    setHorariosPorDia(prev => {
      const nuevo = { ...prev, [dia]: { ...prev[dia], [campo]: valor } };
      if (mismoHorarioTodos && dia === 'lunes') {
        days.forEach(d => {
          nuevo[d] = { ...nuevo['lunes'] };
        });
      }
      return nuevo;
    });
  };

  const marcarDiaLibre = (dia) => {
    setHorariosPorDia(prev => {
      const nuevo = { ...prev, [dia]: { ...prev[dia], libre: !prev[dia].libre } };
      if (mismoHorarioTodos && dia === 'lunes') {
        days.forEach(d => {
          nuevo[d] = { ...nuevo['lunes'] };
        });
      }
      return nuevo;
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-foreground mb-2">Detalles de la Oferta</h3>
        <p className="text-muted-foreground">Describa las condiciones, características y necesidades del puesto vacante.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Puesto / Título */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="oferta_titulo">Puesto a cubrir <span className="text-destructive">*</span></Label>
          <Input 
            id="oferta_titulo" 
            placeholder="Ej: Desarrollador Frontend Senior" 
            value={formData.oferta_titulo || ''} 
            onChange={(e) => updateData('oferta_titulo', e.target.value)}
            className={errors.oferta_titulo ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {errors.oferta_titulo && <p className="text-sm text-destructive mt-1.5 font-medium">{errors.oferta_titulo}</p>}
        </div>

        {/* Vacantes */}
        <div className="space-y-2">
          <Label htmlFor="oferta_vacantes">Número de vacantes <span className="text-destructive">*</span></Label>
          <Input 
            id="oferta_vacantes" 
            type="number"
            min="1"
            placeholder="Ej: 1" 
            value={formData.oferta_vacantes || ''} 
            onChange={(e) => updateData('oferta_vacantes', e.target.value)}
            className={errors.oferta_vacantes ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {errors.oferta_vacantes && <p className="text-sm text-destructive mt-1.5 font-medium">{errors.oferta_vacantes}</p>}
        </div>

        {/* Fecha de incorporación */}
        <div className="space-y-2">
          <Label htmlFor="oferta_fecha_incorporacion">Fecha esperada de incorporación <span className="text-destructive">*</span></Label>
          <Input 
            id="oferta_fecha_incorporacion" 
            type="date"
            value={formData.oferta_fecha_incorporacion || ''} 
            onChange={(e) => updateData('oferta_fecha_incorporacion', e.target.value)}
            className={errors.oferta_fecha_incorporacion ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {errors.oferta_fecha_incorporacion && <p className="text-sm text-destructive mt-1.5 font-medium">{errors.oferta_fecha_incorporacion}</p>}
        </div>

        {/* Urgencia */}
        <div className="space-y-2">
          <Label htmlFor="oferta_urgencia">Urgencia de contratación</Label>
          <Select 
            value={formData.oferta_urgencia || ''} 
            onValueChange={(val) => updateData('oferta_urgencia', val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Nivel de urgencia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Inmediata">Inmediata (Esta semana)</SelectItem>
              <SelectItem value="Alta">Alta (1-2 semanas)</SelectItem>
              <SelectItem value="Media">Media (1 mes)</SelectItem>
              <SelectItem value="Baja">Baja (Sin prisa)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Descripción */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="oferta_descripcion">Descripción general del puesto</Label>
          <Textarea 
            id="oferta_descripcion" 
            placeholder="Describa el rol, responsabilidades y lo que se espera del candidato..." 
            className="min-h-[100px] resize-y"
            value={formData.oferta_descripcion || ''} 
            onChange={(e) => updateData('oferta_descripcion', e.target.value)}
          />
        </div>

        <div className="col-span-1 md:col-span-2 mt-4">
          <h4 className="font-semibold text-lg border-b border-border pb-2 mb-4">Condiciones Laborales</h4>
        </div>

        {/* Tipo de contrato */}
        <div className="space-y-2">
          <Label htmlFor="oferta_tipo_contrato">Tipo de contrato <span className="text-destructive">*</span></Label>
          <Select 
            value={formData.oferta_tipo_contrato || ''} 
            onValueChange={(val) => updateData('oferta_tipo_contrato', val)}
          >
            <SelectTrigger className={errors.oferta_tipo_contrato ? 'border-destructive focus-visible:ring-destructive' : ''}>
              <SelectValue placeholder="Seleccione tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Indefinido">Indefinido</SelectItem>
              <SelectItem value="Temporal">Temporal</SelectItem>
              <SelectItem value="Prácticas">Prácticas</SelectItem>
              <SelectItem value="Autónomo / Freelance">Autónomo / Freelance</SelectItem>
              <SelectItem value="Fijo Discontinuo">Fijo Discontinuo</SelectItem>
            </SelectContent>
          </Select>
          {errors.oferta_tipo_contrato && <p className="text-sm text-destructive mt-1.5 font-medium">{errors.oferta_tipo_contrato}</p>}
        </div>

        {/* Duración del contrato */}
        <div className="space-y-2">
          <Label htmlFor="oferta_duracion_contrato">Duración del contrato (si aplica)</Label>
          <Input 
            id="oferta_duracion_contrato" 
            placeholder="Ej: 6 meses prorrogables" 
            value={formData.oferta_duracion_contrato || ''} 
            onChange={(e) => updateData('oferta_duracion_contrato', e.target.value)}
          />
        </div>

        {/* Periodo de prueba */}
        <div className="space-y-2">
          <Label htmlFor="oferta_periodo_prueba">Periodo de prueba</Label>
          <Select 
            value={formData.oferta_periodo_prueba || 'Sin periodo de prueba'} 
            onValueChange={(val) => updateData('oferta_periodo_prueba', val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione periodo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sin periodo de prueba">Sin periodo de prueba</SelectItem>
              <SelectItem value="15 días">15 días</SelectItem>
              <SelectItem value="1 mes">1 mes</SelectItem>
              <SelectItem value="2 meses">2 meses</SelectItem>
              <SelectItem value="3 meses">3 meses</SelectItem>
              <SelectItem value="6 meses">6 meses</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tipo de jornada */}
        <div className="space-y-2">
          <Label htmlFor="oferta_tipo_jornada">Tipo de jornada</Label>
          <Select 
            value={formData.oferta_tipo_jornada || ''} 
            onValueChange={(val) => updateData('oferta_tipo_jornada', val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione jornada" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Jornada completa">Jornada completa</SelectItem>
              <SelectItem value="Media jornada">Media jornada</SelectItem>
              <SelectItem value="Por horas">Por horas</SelectItem>
              <SelectItem value="Fines de semana">Fines de semana</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Horario Selector - NEW IMPLEMENTATION */}
        <div className="space-y-4 md:col-span-2">
          <Label>Horario de trabajo</Label>
          <div className="bg-muted/30 p-4 rounded-xl border border-border space-y-4">
            
            <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-md border border-gray-200">
              <Checkbox 
                id="mismo_horario" 
                checked={mismoHorarioTodos} 
                onCheckedChange={handleMismoHorarioChange} 
              />
              <Label htmlFor="mismo_horario" className="cursor-pointer font-medium text-gray-800">
                Mismo horario para todos los días
              </Label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {days.map(dia => {
                const datos = horariosPorDia[dia];
                return (
                  <div key={dia} className="space-y-2 border border-border rounded-lg p-3 bg-card shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-semibold text-foreground">{diaLabels[dia]}</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => marcarDiaLibre(dia)}
                        className={`h-7 px-2 text-xs font-medium transition-colors ${
                          datos.libre 
                            ? 'bg-red-100 text-red-700 hover:bg-red-200 border-red-200 hover:text-red-800' 
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {datos.libre ? 'Día libre' : 'Marcar libre'}
                      </Button>
                    </div>
                    
                    {!datos.libre ? (
                      <div className="flex items-center gap-2">
                        <Select 
                          value={datos.inicio} 
                          onValueChange={(val) => handleTimeChange(dia, 'inicio', val)} 
                          disabled={mismoHorarioTodos && dia !== 'lunes'}
                        >
                          <SelectTrigger className="w-full h-9">
                            <SelectValue placeholder="Inicio" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeOptions.map(t => <SelectItem key={`start-${t}`} value={t}>{t}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <span className="text-muted-foreground text-sm font-medium">-</span>
                        <Select 
                          value={datos.fin} 
                          onValueChange={(val) => handleTimeChange(dia, 'fin', val)} 
                          disabled={mismoHorarioTodos && dia !== 'lunes'}
                        >
                          <SelectTrigger className="w-full h-9">
                            <SelectValue placeholder="Fin" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeOptions.map(t => <SelectItem key={`end-${t}`} value={t}>{t}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-9 mt-0 bg-muted/50 rounded-md border border-dashed border-border">
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Día libre</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Días libres */}
        <div className="space-y-2">
          <Label htmlFor="oferta_dias_libres">Días libres / Descansos</Label>
          <Input 
            id="oferta_dias_libres" 
            placeholder="Ej: Sábados y Domingos" 
            value={formData.oferta_dias_libres || ''} 
            onChange={(e) => updateData('oferta_dias_libres', e.target.value)}
          />
        </div>

        {/* Sueldo */}
        <div className="space-y-2">
          <Label htmlFor="oferta_sueldo">Salario bruto mensual (€)</Label>
          <Input 
            id="oferta_sueldo" 
            type="number"
            min="0"
            placeholder="Ej: 2000" 
            value={formData.oferta_sueldo || ''} 
            onChange={(e) => updateData('oferta_sueldo', e.target.value)}
          />
        </div>

        {/* Modalidad */}
        <div className="space-y-2">
          <Label htmlFor="oferta_modalidad">Modalidad de trabajo</Label>
          <Select 
            value={formData.oferta_modalidad || ''} 
            onValueChange={(val) => updateData('oferta_modalidad', val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione modalidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Presencial">Presencial</SelectItem>
              <SelectItem value="Híbrido">Híbrido</SelectItem>
              <SelectItem value="Remoto (100%)">Remoto (100%)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Ubicación */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="oferta_ubicacion">Ubicación del puesto de trabajo</Label>
          <Input 
            id="oferta_ubicacion" 
            placeholder="Ciudad o zona de trabajo" 
            value={formData.oferta_ubicacion || ''} 
            onChange={(e) => updateData('oferta_ubicacion', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Paso2Oferta;