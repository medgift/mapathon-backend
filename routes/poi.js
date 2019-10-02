var express = require("express");
var router = express.Router();
var models = require("../models");

const isCreator = require("../middleware/isCreator");

const crud = require("./crud");

let modelName = "POI";

let modelOptions = {
  include: [
    models.Status,
    {
      model: models.Category,
      through: { attributes: [] }
    },
    {
      model: models.Tag,
      through: { attributes: [] }
    }
  ],
  attributes: {
    exclude: ["statusId", "gpxFileId"]
  }
};

router.get("/", crud.getAll(modelName, modelOptions));

router.get("/:id", crud.getInstance(modelName, modelOptions));

router.post("/", crud.createInstance(modelName, modelOptions));

router.patch(
  "/:id",
  isCreator({ model: modelName }),
  crud.updateInstance(modelName, modelOptions)
);

router.patch(
  "/:id/status",
  isCreator({ model: modelName }),
  crud.associateInstance(modelName, "Status", modelOptions)
);

router.patch(
  "/:id/category",
  isCreator({ model: modelName }),
  crud.associateInstances(modelName, "Category", modelOptions)
);

router.patch(
  "/:id/tag",
  isCreator({ model: modelName }),
  crud.associateInstances(modelName, "Tag", modelOptions)
);

router.delete(
  "/:id",
  isCreator({ model: modelName }),
  crud.deleteInstance(modelName, modelOptions)
);

module.exports = router;
