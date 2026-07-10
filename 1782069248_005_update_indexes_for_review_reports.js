/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("review_reports");
  collection.indexes.push("CREATE UNIQUE INDEX idx_review_reports_reviewId_userId ON review_reports (reviewId, userId)");
  return app.save(collection);
}, (app) => {
  try {
  const collection = app.findCollectionByNameOrId("review_reports");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_review_reports_reviewId_userId"));
  return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})