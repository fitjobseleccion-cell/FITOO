/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("ofertas");

  const existing = collection.fields.getByName("incorporacion_inmediata");
  if (existing) {
    if (existing.type === "bool") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("incorporacion_inmediata"); // exists with wrong type, remove first
  }

  collection.fields.add(new BoolField({
    name: "incorporacion_inmediata"
  }));

  return app.save(collection);
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("ofertas");
    collection.fields.removeByName("incorporacion_inmediata");
    return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})