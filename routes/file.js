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

const upload = multer({ storage: storage });

const isCreator = require("../middleware/isCreator");

const crud = require("./crud");

let modelName = "File";

let modelOptions = {};

router.get("/", crud.getAll(modelName, modelOptions));

router.get("/:id", crud.getInstance(modelName, modelOptions));

router.get("/download/:filename", async (req, res, next) => {
  let foundFile = await models.File.findOne({
    where: { path: `${process.env.UPLOAD_DIRECTORY}/${req.params.filename}` }
  });

  res.sendFile(foundFile.path);
});

router.post("/", upload.single("file"), async (req, res, next) => {
  console.log(`Going to upload file ${JSON.stringify(req.file)}`);
  if (!req.file) return errorHandler.sendBadRequest(res);

  const fileObject = {
    path: req.file.path,
    url: `${req.protocol}://${req.headers.host}${process.env.UPLOAD_BASE_URL}/${req.file.filename}`
  };

  let createdFile = await queries.createInstance(
    "File",
    fileObject,
    req.user.sub
  );

  res.send(createdFile);
});

/*router.patch(
  "/:id",
  isCreator({ model: modelName }),
  crud.updateInstance(modelName, modelOptions)
);*/

router.delete(
  "/:id",
  isCreator({ model: modelName }),
  crud.deleteInstance(modelName, modelOptions)
);

module.exports = router;
