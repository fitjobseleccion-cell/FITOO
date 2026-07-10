/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("candidaturas");
  collection.indexes.push("CREATE UNIQUE INDEX idx_candidaturas_email_oferta ON candidaturas (email, oferta_id)");
  return app.save(collection);
}, (app) => {
  try {
  const collection = app.findCollectionByNameOrId("candidaturas");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_candidaturas_email_oferta"));
  return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})