/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("reviews");
  collection.indexes.push("CREATE UNIQUE INDEX idx_reviews_userId_serviceId ON reviews (userId, serviceId)");
  return app.save(collection);
}, (app) => {
  try {
  const collection = app.findCollectionByNameOrId("reviews");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_reviews_userId_serviceId"));
  return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})