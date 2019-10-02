const models = require("../models");
const errorHandler = require("../utils/error-handler");

// route middleware to ensure user is the creator of a resource
module.exports = function(options) {
  return async function(req, res, next) {
    // Implement the middleware function based on the options object
    let model = options.model;
    let creatorFK = options.creatorFK ? options.creatorFK : "creatorId";

    let instance = await models[model].findByPk(+req.params.id);

    if (!instance) {
      return errorHandler.sendNotFound(res);
    }

    if (!req.user || req.user.sub !== instance[creatorFK]) {
      return errorHandler.sendForbidden(res);
    }

    // Everything is fine
    next();
  };
};
