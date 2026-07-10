/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("valoraciones_fito");
  collection.indexes.push("CREATE UNIQUE INDEX idx_valoraciones_fito_sesion_id ON valoraciones_fito (sesion_id)");
  return app.save(collection);
}, (app) => {
  try {
  const collection = app.findCollectionByNameOrId("valoraciones_fito");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_valoraciones_fito_sesion_id"));
  return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})