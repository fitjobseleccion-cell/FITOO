/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("cv_generator_sessions");

  const existing = collection.fields.getByName("paymentStatus");
  if (existing) {
    if (existing.type === "select") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("paymentStatus"); // exists with wrong type, remove first
  }

  collection.fields.add(new SelectField({
    name: "paymentStatus",
    values: ["pending", "confirmed"]
  }));

  return app.save(collection);
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("cv_generator_sessions");
    collection.fields.removeByName("paymentStatus");
    return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})