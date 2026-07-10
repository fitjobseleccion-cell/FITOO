/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("candidatos");

  const record0 = new Record(collection);
    record0.id = "i5p6o2x08a23331";
    record0.set("nombre", "Juan");
    record0.set("apellidos", "Garc\u00eda");
    record0.set("email", "juan.garcia@test.com");
    record0.set("telefono", "612345678");
    record0.set("ciudad", "Madrid");
    record0.set("provincia", "Madrid");
    record0.set("fecha_nacimiento", "1990-01-15");
    record0.set("permiso_trabajo", "s\u00ed");
    record0.set("estado_candidatura", "recibido");
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
    record1.id = "911m91b0agsgc56";
    record1.set("nombre", "Mar\u00eda");
    record1.set("apellidos", "L\u00f3pez");
    record1.set("email", "maria.lopez@test.com");
    record1.set("telefono", "612345679");
    record1.set("ciudad", "Madrid");
    record1.set("provincia", "Madrid");
    record1.set("fecha_nacimiento", "1992-03-20");
    record1.set("permiso_trabajo", "s\u00ed");
    record1.set("estado_candidatura", "recibido");
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

  const record2 = new Record(collection);
    record2.id = "mt2w1t0ircsn3wk";
    record2.set("nombre", "Carlos");
    record2.set("apellidos", "Mart\u00ednez");
    record2.set("email", "carlos.martinez@test.com");
    record2.set("telefono", "612345680");
    record2.set("ciudad", "Madrid");
    record2.set("provincia", "Madrid");
    record2.set("fecha_nacimiento", "1988-06-10");
    record2.set("permiso_trabajo", "s\u00ed");
    record2.set("estado_candidatura", "recibido");
    const record2_oferta_idLookup = app.findFirstRecordByFilter("ofertas", "titulo='Prueba Límite Candidatos'");
    if (!record2_oferta_idLookup) { throw new Error("Lookup failed for oferta_id: no record in 'ofertas' matching \"titulo='Prueba Límite Candidatos'\""); }
    record2.set("oferta_id", record2_oferta_idLookup.id);
  try {
    app.save(record2);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }
}, (app) => {
  const seededRecordIds = ["mt2w1t0ircsn3wk", "911m91b0agsgc56", "i5p6o2x08a23331"];
  for (const seededRecordId of seededRecordIds) {
    try {
      app.delete(app.findRecordById("candidatos", seededRecordId));
    } catch (error) {
      if (error.message.includes("no rows in result set")) {
        continue;
      }
      throw error;
    }
  }
})