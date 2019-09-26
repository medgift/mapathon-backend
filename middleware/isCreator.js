const models = require("../models");

// route middleware to ensure user is logged in
async function isCreator(req, res, next) {
  let poi = await models.POI.findByPk(+req.params.id);

  if (!poi) {
    return res
      .status(404)
      .send({ error: { status: 404, title: "This POI does not exist" } });
  }

  if (!req.user || req.user.sub !== poi.creatorId) {
    return res.status(403).send({
      error: {
        status: 403,
        title: "You are not allowed to modify this resource"
      }
    });
  }

  // Everything is fine
  return next();
}

module.exports = isCreator;
