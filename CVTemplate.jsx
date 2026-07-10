import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import SkillIcon from './SkillIcon.jsx';

export default function CVTemplate({ data, id }) {
  const {
    nombre = '',
    apellidos = '',
    puesto = '',
    telefono = '',
    email = '',
    ciudad = '',
    sobreMi = '',
    aptitudes = '',
    habilidades = '',
    experiencia = [],
    educacion = [],
    photo = null
  } = data;

  const aptitudesList = aptitudes ? aptitudes.split(',').map(s => s.trim()).filter(s => s) : [];
  const habilidadesList = habilidades ? habilidades.split(',').map(s => s.trim()).filter(s => s) : [];

  const displayNombre = nombre || 'Tu Nombre';
  const displayApellidos = apellidos || 'Tus Apellidos';
  const displayPuesto = puesto || 'Puesto Deseado';

  return (
    <div 
      id={id} 
      className="bg-white mx-auto relative"
      style={{ 
        width: '794px', 
        minHeight: '1123px',
        padding: '48px',
        boxSizing: 'border-box',
        color: 'hsl(var(--cv-dark-gray))',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}
    >
      {/* HEADER SECTION */}
      <header className="flex justify-between items-start mb-8 w-full">
        <div className="flex-1 pr-6 pt-2 break-words">
          <h1 className="text-[42px] font-extrabold leading-none tracking-tight text-[hsl(var(--cv-dark-gray))] uppercase mb-2">
            {displayNombre} {displayApellidos}
          </h1>
          <h2 className="text-[18px] font-bold italic uppercase text-[hsl(var(--cv-dark-gray))]/80 mb-6">
            {displayPuesto}
          </h2>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[14px] text-[hsl(var(--cv-dark-gray))] break-all">
              <Phone className="w-4 h-4 shrink-0" />
              <span>{telefono || '+34 600 000 000'}</span>
            </div>
            <div className="flex items-center gap-2 text-[14px] text-[hsl(var(--cv-dark-gray))] break-all">
              <Mail className="w-4 h-4 shrink-0" />
              <span>{email || 'correo@ejemplo.com'}</span>
            </div>
            <div className="flex items-center gap-2 text-[14px] text-[hsl(var(--cv-dark-gray))] break-words">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>{ciudad || 'Tu Ciudad'}</span>
            </div>
          </div>
        </div>

        <div className="shrink-0 flex items-start justify-end">
          {photo ? (
            <img 
              src={photo} 
              alt="Foto de perfil" 
              className="w-[130px] h-[130px] object-cover rounded-2xl shadow-sm border-2 border-[hsl(var(--cv-border-color))]"
            />
          ) : (
            <div className="w-[130px] h-[130px] rounded-2xl bg-[hsl(var(--cv-light-bg))] border-2 border-[hsl(var(--cv-border-color))] flex items-center justify-center text-[hsl(var(--cv-dark-gray))]/20">
              <span className="text-4xl font-bold uppercase">
                {displayNombre[0]}{displayApellidos[0]}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* SOBRE MI SECTION */}
      <section className="mb-8 w-full">
        <h3 className="text-[16px] font-bold uppercase tracking-wider text-[hsl(var(--cv-dark-gray))] mb-3 border-b-2 border-[hsl(var(--cv-border-color))] pb-1 inline-block">
          Sobre Mí
        </h3>
        
        <div className="bg-[hsl(var(--cv-light-bg))] rounded-xl p-5 flex gap-6 w-full">
          <div className="flex-1 text-[14px] leading-relaxed whitespace-pre-wrap break-words min-w-0">
            {sobreMi || 'Escribe un breve resumen sobre tu perfil profesional, objetivos y lo que puedes aportar a una empresa.'}
          </div>
          
          {aptitudesList.length > 0 && (
            <div className="w-[200px] shrink-0 border-l border-[hsl(var(--cv-border-color))] pl-6 flex flex-col">
              <h4 className="text-[14px] font-bold text-[hsl(var(--cv-accent-blue))] uppercase tracking-wide mb-4">
                Aptitudes
              </h4>
              <div className="flex flex-wrap gap-y-4 gap-x-2">
                {aptitudesList.map((aptitude, idx) => (
                  <SkillIcon key={idx} skill={aptitude} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* EXPERIENCIA SECTION */}
      <section className="mb-8 w-full">
        <h3 className="text-[16px] font-bold uppercase tracking-wider text-[hsl(var(--cv-dark-gray))] mb-4 border-b-2 border-[hsl(var(--cv-border-color))] pb-1 inline-block">
          Experiencia
        </h3>
        
        <div className="flex flex-col w-full">
          {experiencia && experiencia.filter(e => e.empresa || e.puesto).length > 0 ? (
            experiencia.map((exp, index, arr) => (
              <div key={exp.id || index} className="flex gap-4 w-full">
                <div className="flex flex-col items-center pt-1.5 shrink-0 w-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--cv-dark-gray))] shrink-0" />
                  {index !== arr.length - 1 && (
                    <div className="w-0.5 bg-[hsl(var(--cv-border-color))] flex-1 my-1" />
                  )}
                </div>
                <div className="flex-1 pb-6 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2 text-[14px] mb-1">
                    <span className="font-semibold text-[hsl(var(--cv-dark-gray))]/80 uppercase">
                      {exp.fechaInicio || 'Inicio'} - {exp.fechaFin || 'Presente'}
                    </span>
                    <span className="text-[hsl(var(--cv-dark-gray))]/40">|</span>
                    <span className="font-bold uppercase break-words">{exp.empresa || 'Nombre de la Empresa'}</span>
                  </div>
                  <div className="text-[15px] font-bold italic text-[hsl(var(--cv-dark-gray))] mb-2 break-words">
                    {exp.puesto || 'Puesto Ocupado'}
                  </div>
                  <div className="text-[14px] leading-relaxed whitespace-pre-wrap text-[hsl(var(--cv-dark-gray))]/90 break-words">
                    {exp.funciones || 'Describe tus responsabilidades y logros principales.'}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-[14px] text-[hsl(var(--cv-dark-gray))]/50 italic pl-4">
              Añade tu experiencia laboral en el formulario.
            </div>
          )}
        </div>
      </section>

      {/* BOTTOM TWO COLUMNS: EDUCACION & HABILIDADES */}
      <div className="grid grid-cols-2 gap-8 w-full">
        <section className="min-w-0">
          <h3 className="text-[16px] font-bold uppercase tracking-wider text-[hsl(var(--cv-dark-gray))] mb-4 border-b-2 border-[hsl(var(--cv-border-color))] pb-1 inline-block">
            Educación
          </h3>
          <div className="flex flex-col gap-4">
            {educacion && educacion.filter(e => e.centro || e.titulacion).length > 0 ? (
              educacion.map((edu, index) => (
                <div key={edu.id || index} className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-2 mb-1">
                    <span className="font-bold text-[14px] uppercase shrink-0">{edu.fechaFin || edu.fechaInicio || 'Año'}</span>
                    <span className="font-bold text-[14px] uppercase text-[hsl(var(--cv-dark-gray))] break-words">
                      {edu.titulacion || 'Titulación'}
                    </span>
                  </div>
                  <div className="text-[14px] text-[hsl(var(--cv-dark-gray))]/80 break-words">
                    {edu.centro || 'Centro Educativo'}
                    {edu.fechaInicio && edu.fechaFin && ` (${edu.fechaInicio} - ${edu.fechaFin})`}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-[14px] text-[hsl(var(--cv-dark-gray))]/50 italic">
                Añade tu formación académica.
              </div>
            )}
          </div>
        </section>

        <section className="min-w-0">
          <h3 className="text-[16px] font-bold uppercase tracking-wider text-[hsl(var(--cv-dark-gray))] mb-4 border-b-2 border-[hsl(var(--cv-border-color))] pb-1 inline-block">
            Habilidades Personales
          </h3>
          <div className="flex flex-col gap-2">
            {habilidadesList.length > 0 ? (
              habilidadesList.map((hab, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[14px] min-w-0">
                  <span className="text-[hsl(var(--cv-accent-blue))] mt-0.5 shrink-0">•</span>
                  <span className="break-words">{hab}</span>
                </div>
              ))
            ) : (
              <div className="text-[14px] text-[hsl(var(--cv-dark-gray))]/50 italic">
                Añade habilidades como: Liderazgo, Trabajo en equipo, etc.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}