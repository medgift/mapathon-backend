var express = require("express");
var router = express.Router();
var models = require("../models");

const errorHandler = require("../utils/error-handler");

const isCreator = require("../middleware/isCreator");

const crud = require("./crud");

let modelName = "POI";

let modelOptions = {
  include: [
    models.Status,
    {
      model: models.Category,
      through: { attributes: [] }
    }
  ],
  attributes: {
    exclude: ["statusId", "fileId"]
  }
};

let additionalFields = {
  liked: async (userId, poi) => {
    let like = await models.Like.findOne({
      where: { POIId: poi.id, userId: userId }
    });
    return like !== null;
  },
  likes: async (userId, poi) => {
    let likes = await models.Like.count({
      where: { POIID: poi.id }
    });
    return likes;
  }
};

router.get("/", crud.getAll(modelName, modelOptions, additionalFields));

router.get("/:id", crud.getInstance(modelName, modelOptions, additionalFields));

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
  "/:id/file",
  isCreator({ model: modelName }),
  crud.associateInstance(modelName, "File", modelOptions)
);

router.patch("/:id/like", async (req, res, next) => {
  if (!req.user) {
    errorHandler.sendBadRequest(res);
    return;
  }

  let poi = await models.POI.findByPk(+req.params.id);

  if (!poi) {
    return errorHandler.sendNotFound(res);
  }

  let existingLike = await models.Like.findOne({
    where: { userId: req.user.sub, POIId: +req.params.id }
  });

  if (!existingLike) {
    await models.Like.create({
      userId: req.user.sub,
      POIId: +req.params.id
    });

    res.status(201).send({ message: "Liked" });
    return;
  }

  res.send({ message: "Liked" });
});

router.patch("/:id/unlike", async (req, res, next) => {
  if (!req.user) {
    errorHandler.sendBadRequest(res);
    return;
  }

  let poi = await models.POI.findByPk(+req.params.id);

  if (!poi) {
    return errorHandler.sendNotFound(res);
  }

  let existingLike = await models.Like.findOne({
    where: { userId: req.user.sub, POIId: +req.params.id }
  });

  if (!existingLike) {
    return errorHandler.sendNotFound(res);
  }

  await existingLike.destroy();

  res.send({ message: "Unliked" });
});

router.delete(
  "/:id",
  isCreator({ model: modelName }),
  crud.deleteInstance(modelName, modelOptions)
);

module.exports = router;
