/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("ofertas");

  const record0 = new Record(collection);
    record0.id = "y0pzaghntr0fp7u";
    record0.set("titulo", "Prueba L\u00edmite Candidatos");
    record0.set("empresa", "Empresa Test");
    record0.set("ubicacion", "Madrid");
    record0.set("tipo_contrato", "indefinido");
    record0.set("jornada", "completa");
    record0.set("descripcion", "Oferta de prueba para validar l\u00edmite de desbloqueos");
    record0.set("estado", "publicada");
    record0.set("puesto", "Puesto Test");
    record0.set("ciudad", "Madrid");
    record0.set("provincia", "Madrid");
    const record0_admin_idLookup = app.findFirstRecordByFilter("users", "email='testadmin@prueba.com'");
    if (!record0_admin_idLookup) { throw new Error("Lookup failed for admin_id: no record in 'users' matching \"email='testadmin@prueba.com'\""); }
    record0.set("admin_id", record0_admin_idLookup.id);
  try {
    app.save(record0);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }
}, (app) => {
  const seededRecordIds = ["y0pzaghntr0fp7u"];
  for (const seededRecordId of seededRecordIds) {
    try {
      app.delete(app.findRecordById("ofertas", seededRecordId));
    } catch (error) {
      if (error.message.includes("no rows in result set")) {
        continue;
      }
      throw error;
    }
  }
})