/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("company_plans");

  const record0 = new Record(collection);
    record0.id = "1zbaw07tqjxudg9";
    const record0_admin_idLookup = app.findFirstRecordByFilter("users", "email='testadmin@prueba.com'");
    if (!record0_admin_idLookup) { throw new Error("Lookup failed for admin_id: no record in 'users' matching \"email='testadmin@prueba.com'\""); }
    record0.set("admin_id", record0_admin_idLookup.id);
    record0.set("plan", "gratis");
    record0.set("limite_candidatos", 2);
    record0.set("candidatos_desbloqueados_mes", 0);
    record0.set("fecha_inicio_periodo", "2026-07-06");
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
  const seededRecordIds = ["1zbaw07tqjxudg9"];
  for (const seededRecordId of seededRecordIds) {
    try {
      app.delete(app.findRecordById("company_plans", seededRecordId));
    } catch (error) {
      if (error.message.includes("no rows in result set")) {
        continue;
      }
      throw error;
    }
  }
})