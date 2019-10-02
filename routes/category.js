var express = require("express");
var router = express.Router();

const isCreator = require("../middleware/isCreator");

const crud = require("./crud");

let modelName = "Category";

let modelOptions = {};

router.get("/", crud.getAll(modelName, modelOptions));

router.get("/:id", crud.getInstance(modelName, modelOptions));

router.post("/", crud.createInstance(modelName, modelOptions));

router.patch(
  "/:id",
  isCreator({ model: modelName }),
  crud.updateInstance(modelName, modelOptions)
);

router.delete(
  "/:id",
  isCreator({ model: modelName }),
  crud.deleteInstance(modelName, modelOptions)
);

module.exports = router;
