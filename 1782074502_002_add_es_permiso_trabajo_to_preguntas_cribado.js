/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("preguntas_cribado");

  const existing = collection.fields.getByName("es_permiso_trabajo");
  if (existing) {
    if (existing.type === "bool") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("es_permiso_trabajo"); // exists with wrong type, remove first
  }

  collection.fields.add(new BoolField({
    name: "es_permiso_trabajo",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("preguntas_cribado");
    collection.fields.removeByName("es_permiso_trabajo");
    return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})