const queries = require("../utils/queries");
const errorHandler = require("../utils/error-handler");

module.exports.getAll = function(model, options) {
  return async function(req, res, next) {
    const instances = await queries.getAll(model, options);
    res.send(instances);
  };
};

module.exports.getInstance = function(model, options) {
  return async function(req, res, next) {
    const instance = await queries.getInstance(model, +req.params.id, options);

    if (!instance) {
      return errorHandler.sendNotFound(res);
    }

    res.send(instance);
  };
};

module.exports.createInstance = function(model, options) {
  return async function(req, res, next) {
    const createdInstance = await queries.createInstance(
      model,
      req.body,
      req.user.sub
    );

    res.send(createdInstance);
  };
};

module.exports.updateInstance = function(model, options) {
  return async function(req, res, next) {
    const updatedInstance = await queries.updateInstance(
      model,
      +req.params.id,
      req.body,
      options
    );

    res.send(updatedInstance);
  };
};

module.exports.deleteInstance = function(model, options) {
  return async function(req, res, next) {
    const deletedInstance = await queries.deleteInstance(
      model,
      +req.params.id,
      options
    );

    res.send(deletedInstance);
  };
};
