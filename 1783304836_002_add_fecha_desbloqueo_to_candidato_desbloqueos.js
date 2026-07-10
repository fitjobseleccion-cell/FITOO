/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("candidato_desbloqueos");

  const existing = collection.fields.getByName("fecha_desbloqueo");
  if (existing) {
    if (existing.type === "autodate") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("fecha_desbloqueo"); // exists with wrong type, remove first
  }

  collection.fields.add(new AutodateField({
    name: "fecha_desbloqueo",
    onCreate: true,
    onUpdate: false
  }));

  return app.save(collection);
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("candidato_desbloqueos");
    collection.fields.removeByName("fecha_desbloqueo");
    return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})