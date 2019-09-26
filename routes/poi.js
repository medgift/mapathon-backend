var express = require("express");
var router = express.Router();
var models = require("../models");

const auth0UserInfo = require("../auth0/user-info");

const isCreator = require("../middleware/isCreator");

// General options for querying POIs
let poiOptions = {
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

// Get the POIs
router.get("/", async function(req, res, next) {
  let pois = await models.POI.findAll(poiOptions);

  let users = await auth0UserInfo.getAllUsers();

  let usersById = users.reduce((accumulator, user) => {
    accumulator[user.user_id] = user;
    return accumulator;
  }, {});

  let decoratePOIsPromises = pois.map(poi =>
    decoratePOI(poi, usersById[poi.creatorId])
  );

  let decoratedPOIs = await Promise.all(decoratePOIsPromises);

  let response = {
    data: decoratedPOIs
  };

  res.send(response);
});

// Get a specific POI
router.get("/:id", async function(req, res, next) {
  let poi = await models.POI.findByPk(+req.params.id, poiOptions);

  if (!poi) {
    return res
      .status(404)
      .send({ error: { status: 404, title: "This POI does not exist" } });
  }

  res.send(poi);
});

// Create a new POI
router.post("/", async function(req, res, next) {
  let createdPOI = await models.POI.create(req.body);
  res.send(createdPOI);
});

// Update a POI
router.patch("/:id", isCreator, async function(req, res, next) {
  let poiID = +req.params.id;
  let poiBody = req.body;

  let poiToUpdate = await models.POI.findByPk(poiID, poiOptions);
  let updatedPOI = await poiToUpdate.update(poiBody);

  let poiCreator = await auth0UserInfo.getUserInfo(updatedPOI.creatorId);

  let decoratedPOI = await decoratePOI(updatedPOI, poiCreator);

  res.send(decoratedPOI);
});

// Delete a POI
router.delete("/:id", isCreator, async function(req, res, next) {
  let poiToDelete = await models.POI.findByPk(+req.params.id, poiOptions);

  let deletedPOI = await poiToDelete.destroy();

  let poiCreator = await auth0UserInfo.getUserInfo(poiToDelete.creatorId);

  let decoratedPOI = await decoratePOI(poiToDelete, poiCreator);

  res.send(decoratedPOI);
});

module.exports = router;

function decoratePOI(poi, poiCreator) {
  let plainPOI = poi.get({ plain: true });
  delete plainPOI.creatorId;

  return {
    ...plainPOI,
    Creator: {
      id: poiCreator.user_id,
      name: poiCreator.name,
      picture: poiCreator.picture,
      email: poiCreator.email
    }
  };
}
