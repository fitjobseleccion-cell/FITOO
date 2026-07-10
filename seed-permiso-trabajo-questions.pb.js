/// <reference path="../pb_data/types.d.ts" />

// DISABLED: Seeding via hooks causes bootstrap panics
// Data seeding should be done via migrations or manual creation instead

onRecordAfterCreateSuccess((e) => {
  e.next(); // Disabled - exit immediately without executing seeding logic
  
  // Original seeding logic below (disabled):
  /*
  const ofertaId = e.record.id;
  
  const questions = [
    {
      oferta_id: ofertaId,
      pregunta: "¿Tiene permiso de trabajo en España?",
      tipo: "si_no",
      obligatoria: true,
      orden: 1
    },
    {
      oferta_id: ofertaId,
      pregunta: "¿Cuántos años de experiencia tiene en el puesto?",
      tipo: "numero",
      obligatoria: true,
      orden: 2
    },
    {
      oferta_id: ofertaId,
      pregunta: "¿Tiene disponibilidad inmediata?",
      tipo: "si_no",
      obligatoria: true,
      orden: 3
    }
  ];
  
  questions.forEach(q => {
    const collection = $app.findCollectionByNameOrId("preguntas_cribado");
    const record = new Record(collection);
    record.load(q);
    $app.save(record);
  });
  */
}, "ofertas");