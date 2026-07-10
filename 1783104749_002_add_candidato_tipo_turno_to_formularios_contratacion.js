/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("formularios_contratacion");

  const existing = collection.fields.getByName("candidato_tipo_turno");
  if (existing) {
    if (existing.type === "text") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("candidato_tipo_turno"); // exists with wrong type, remove first
  }

  collection.fields.add(new TextField({
    name: "candidato_tipo_turno"
  }));

  return app.save(collection);
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("formularios_contratacion");
    collection.fields.removeByName("candidato_tipo_turno");
    return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})