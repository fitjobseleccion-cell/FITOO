/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("ofertas");
  collection.listRule = "estado = 'publicada' || @request.auth.role = 'admin'";
  collection.viewRule = "estado = 'publicada' || @request.auth.role = 'admin'";
  return app.save(collection);
}, (app) => {
  try {
  const collection = app.findCollectionByNameOrId("ofertas");
  collection.listRule = "";
  collection.viewRule = "";
  return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})