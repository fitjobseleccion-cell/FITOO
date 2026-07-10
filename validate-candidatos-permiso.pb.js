/// <reference path="../pb_data/types.d.ts" />

onRecordCreate((e) => {
  try {
    // Validate collection exists
    const collection = $app.findCollectionByNameOrId("candidatos");
    if (!collection) {
      console.log("Collection 'candidatos' not found, skipping validation");
      e.next();
      return;
    }

    const permisoTrabajo = e.record.get("permiso_trabajo");
    
    if (!permisoTrabajo || permisoTrabajo === "no") {
      throw new BadRequestError("Debe tener permiso de trabajo válido para inscribirse");
    }
  } catch (error) {
    if (error instanceof BadRequestError) {
      throw error;
    }
    console.error("Error in validate-candidatos-permiso hook:", error);
  }
  
  e.next();
}, "candidatos");