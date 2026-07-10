/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("preguntas_cribado");

  const existing = collection.fields.getByName("respuesta_descarte");
  if (existing) {
    if (existing.type === "text") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("respuesta_descarte"); // exists with wrong type, remove first
  }

  collection.fields.add(new TextField({
    name: "respuesta_descarte",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("preguntas_cribado");
    collection.fields.removeByName("respuesta_descarte");
    return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})