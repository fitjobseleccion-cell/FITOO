import React from 'react';
import { motion } from 'framer-motion';

const ProcessStepsSection = () => {
  const steps = [
    {
      num: 1,
      title: 'Confirmación del pago',
      desc: 'Recibirás un correo electrónico confirmando la activación del servicio.'
    },
    {
      num: 2,
      title: 'Documentación del servicio',
      desc: 'Te enviaremos el contrato de prestación de servicios y un documento explicativo con el funcionamiento completo del proceso de selección.'
    },
    {
      num: 3,
      title: 'Inicio de la búsqueda',
      desc: 'Nuestro equipo comenzará inmediatamente la búsqueda activa de candidatos.'
    },
    {
      num: 4,
      title: 'Filtrado y validación',
      desc: 'Realizaremos entrevistas iniciales y validaremos la experiencia y disponibilidad de los candidatos.'
    },
    {
      num: 5,
      title: 'Presentación de candidatos',
      desc: 'Recibirás perfiles preparados para entrevista en un plazo orientativo de 24 a 72 horas.'
    },
    {
      num: 6,
      title: 'Selección final',
      desc: 'Tu empresa entrevistará a los candidatos y decidirá qué perfil incorporar.'
    }
  ];

  return (
    <div className="bg-card border border-border shadow-sm rounded-2xl p-6 md:p-8 mt-8">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-4">¿Qué ocurre después?</h3>
        <p className="text-[#111827] dark:text-gray-300 leading-relaxed text-lg">
          Una vez completado el pago, nuestro equipo inicia inmediatamente el proceso de selección asociado a la vacante solicitada. Recibirás automáticamente un correo electrónico de confirmación con toda la información necesaria para comenzar el proceso.
        </p>
      </div>

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
        {steps.map((step, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-background bg-[#16A34A] text-white font-bold text-lg shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 relative">
              {step.num}
            </div>
            
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-muted/30 p-5 rounded-xl border border-border/50 hover:border-[#16A34A]/30 transition-colors">
              <h4 className="font-bold text-[#111827] dark:text-white mb-2 text-lg">{step.title}</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 p-5 bg-[#16A34A]/10 rounded-xl border border-[#16A34A]/20">
        <p className="text-[#111827] dark:text-white font-medium text-center leading-relaxed">
          Nuestro objetivo es que dediques tu tiempo a entrevistar candidatos cualificados, mientras nosotros nos ocupamos de la búsqueda, filtrado y validación previa.
        </p>
      </div>
    </div>
  );
};

export default ProcessStepsSection;