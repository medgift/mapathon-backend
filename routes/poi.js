var express = require("express");
var router = express.Router();
var models = require("../models");

// Get the POIs
router.get("/", async function(req, res, next) {
  let pois = await models.POI.findAll({
    include: [models.User, models.Status, models.Category, models.Tag]
  });

  let response = {
    data: pois
  };

  res.send(response);
});

module.exports = router;
