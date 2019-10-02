var express = require("express");
var router = express.Router();

const models = require("../models");

const errorHandler = require("../utils/error-handler");

const queries = require("../utils/queries");

const slugify = require("slugify");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIRECTORY);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${slugify(file.originalname)}`);
  }
});

const gpxFilter = (req, file, cb) => {
  if (
    file.mimetype !== "application/gpx+xml" ||
    !file.originalname.endsWith(".gpx")
  ) {
    cb(null, false);
  } else {
    cb(null, true);
  }
};
const upload = multer({ storage: storage, fileFilter: gpxFilter });

const isCreator = require("../middleware/isCreator");

const crud = require("./crud");

let modelName = "GPXFile";

let modelOptions = {};

router.get("/", crud.getAll(modelName, modelOptions));

router.get("/:id", crud.getInstance(modelName, modelOptions));

router.get("/download/:filename", async (req, res, next) => {
  let foundGPXFile = await models.GPXFile.findOne({
    where: { path: `${process.env.UPLOAD_DIRECTORY}/${req.params.filename}` }
  });

  res.sendFile(foundGPXFile.path);
});

router.post("/", upload.single("file"), async (req, res, next) => {
  if (!req.file) return errorHandler.sendBadRequest(res);

  const gpxFileObject = {
    path: req.file.path,
    url: `${req.protocol}://${req.headers.host}${process.env.UPLOAD_BASE_URL}/${req.file.filename}`
  };

  let createdGPXFile = await queries.createInstance(
    "GPXFile",
    gpxFileObject,
    req.user.sub
  );

  res.send(createdGPXFile);
});

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
