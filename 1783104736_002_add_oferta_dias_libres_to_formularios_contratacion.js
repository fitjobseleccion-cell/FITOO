/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("formularios_contratacion");

  const existing = collection.fields.getByName("oferta_dias_libres");
  if (existing) {
    if (existing.type === "text") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("oferta_dias_libres"); // exists with wrong type, remove first
  }

  collection.fields.add(new TextField({
    name: "oferta_dias_libres"
  }));

  return app.save(collection);
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("formularios_contratacion");
    collection.fields.removeByName("oferta_dias_libres");
    return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})