var express = require("express");
var router = express.Router();
var models = require("../models");

const auth0UserInfo = require("../auth0/user-info");

// Get the POIs
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

router.get("/", async function(req, res, next) {
  let pois = await models.POI.findAll(poiOptions);

  let users = await auth0UserInfo.getAllUsers();

  let usersById = users.reduce((accumulator, user) => {
    accumulator[user.user_id] = user;
    return accumulator;
  }, {});

  let decoratedPois = await decoratePOIs(pois, usersById);

  let response = {
    data: decoratedPois
  };

  res.send(response);
});

router.post("/", async function(req, res, next) {
  let createdPOI = await models.POI.create(req.body);
  res.send(createdPOI);
});

router.get("/:id", async function(req, res, next) {
  let poi = await models.POI.findByPk(req.params.id, poiOptions);

  res.send(poi);
});

module.exports = router;

async function decoratePOIs(pois, users) {
  return pois.map(poi => {
    let poiCreator = users[poi.creatorId];
    delete poi.creatorId;
    return {
      ...poi.get({ plain: true }),
      Creator: {
        id: poiCreator.user_id,
        name: poiCreator.name,
        picture: poiCreator.picture,
        email: poiCreator.email
      }
    };
  });
}
