/// <reference path="../pb_data/types.d.ts" />

onRecordAfterCreateSuccess((e) => {
  try {
    // Validate collections exist
    const ofertasCollection = $app.findCollectionByNameOrId("ofertas");
    const preguntasCollection = $app.findCollectionByNameOrId("preguntas_cribado");
    
    if (!ofertasCollection || !preguntasCollection) {
      console.log("Required collections not found, skipping auto-create");
      e.next();
      return;
    }

    const ofertaId = e.record.id;
    
    if (!ofertaId) {
      e.next();
      return;
    }
    
    // Check if permiso_trabajo question already exists for this oferta
    const existingQuestion = $app.findFirstRecordByFilter(
      "preguntas_cribado",
      "oferta_id = {:ofertaId} && pregunta ~ 'permiso de trabajo'",
      { ofertaId: ofertaId }
    );
    
    if (existingQuestion) {
      e.next();
      return;
    }
    
    // Create the permiso_trabajo screening question
    const collection = $app.findCollectionByNameOrId("preguntas_cribado");
    const record = new Record(collection);
    
    record.set("oferta_id", ofertaId);
    record.set("pregunta", "¿Tiene permiso de trabajo válido en España?");
    record.set("tipo", "si_no");
    record.set("obligatoria", true);
    record.set("orden", 1);
    
    $app.save(record);
  } catch (error) {
    console.error("Error in auto-create-permiso-trabajo-question hook:", error);
  }
  
  e.next();
}, "ofertas");