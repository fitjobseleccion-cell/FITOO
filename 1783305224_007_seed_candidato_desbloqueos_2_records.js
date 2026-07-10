/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("candidato_desbloqueos");

  const record0 = new Record(collection);
    record0.id = "bq9r8uijunfmsfg";
    const record0_admin_idLookup = app.findFirstRecordByFilter("users", "email='testadmin@prueba.com'");
    if (!record0_admin_idLookup) { throw new Error("Lookup failed for admin_id: no record in 'users' matching \"email='testadmin@prueba.com'\""); }
    record0.set("admin_id", record0_admin_idLookup.id);
    const record0_candidato_idLookup = app.findFirstRecordByFilter("candidatos", "email='juan.garcia@test.com'");
    if (!record0_candidato_idLookup) { throw new Error("Lookup failed for candidato_id: no record in 'candidatos' matching \"email='juan.garcia@test.com'\""); }
    record0.set("candidato_id", record0_candidato_idLookup.id);
    const record0_oferta_idLookup = app.findFirstRecordByFilter("ofertas", "titulo='Prueba Límite Candidatos'");
    if (!record0_oferta_idLookup) { throw new Error("Lookup failed for oferta_id: no record in 'ofertas' matching \"titulo='Prueba Límite Candidatos'\""); }
    record0.set("oferta_id", record0_oferta_idLookup.id);
  try {
    app.save(record0);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record1 = new Record(collection);
    record1.id = "okcpbct8smcnhnc";
    const record1_admin_idLookup = app.findFirstRecordByFilter("users", "email='testadmin@prueba.com'");
    if (!record1_admin_idLookup) { throw new Error("Lookup failed for admin_id: no record in 'users' matching \"email='testadmin@prueba.com'\""); }
    record1.set("admin_id", record1_admin_idLookup.id);
    const record1_candidato_idLookup = app.findFirstRecordByFilter("candidatos", "email='maria.lopez@test.com'");
    if (!record1_candidato_idLookup) { throw new Error("Lookup failed for candidato_id: no record in 'candidatos' matching \"email='maria.lopez@test.com'\""); }
    record1.set("candidato_id", record1_candidato_idLookup.id);
    const record1_oferta_idLookup = app.findFirstRecordByFilter("ofertas", "titulo='Prueba Límite Candidatos'");
    if (!record1_oferta_idLookup) { throw new Error("Lookup failed for oferta_id: no record in 'ofertas' matching \"titulo='Prueba Límite Candidatos'\""); }
    record1.set("oferta_id", record1_oferta_idLookup.id);
  try {
    app.save(record1);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }
}, (app) => {
  const seededRecordIds = ["okcpbct8smcnhnc", "bq9r8uijunfmsfg"];
  for (const seededRecordId of seededRecordIds) {
    try {
      app.delete(app.findRecordById("candidato_desbloqueos", seededRecordId));
    } catch (error) {
      if (error.message.includes("no rows in result set")) {
        continue;
      }
      throw error;
    }
  }
})