const queries = require("../utils/queries");
const errorHandler = require("../utils/error-handler");

module.exports.getAll = function(model, options, additionalFields) {
  return async function(req, res, next) {
    let opts = { ...options };

    let instances = await queries.getAll(model, opts);

    if (additionalFields) {
      instances = await addAdditionalFields(
        instances,
        req.user.sub,
        additionalFields
      );
    }

    res.send(instances);
  };
};

module.exports.getInstance = function(model, options, additionalFields) {
  return async function(req, res, next) {
    let instance = await queries.getInstance(model, +req.params.id, options);

    if (!instance) {
      return errorHandler.sendNotFound(res);
    }

    if (additionalFields) {
      instance = await addAdditionalFields(
        instance,
        req.user.sub,
        additionalFields
      );
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

module.exports.associateInstance = function(model, target, options) {
  return async function(req, res, next) {
    let targetId = Number.isInteger(req.body) ? req.body : req.body.id;

    const updatedInstance = await queries.associateInstance(
      model,
      +req.params.id,
      target,
      targetId,
      options
    );

    res.send(updatedInstance);
  };
};

module.exports.associateInstances = function(model, target, options) {
  return async function(req, res, next) {
    let targetIds = Number.isInteger(req.body[0])
      ? req.body
      : req.body.map(targetObject => targetObject.id);

    const updatedInstance = await queries.associateInstances(
      model,
      +req.params.id,
      target,
      targetIds,
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

async function addAdditionalFields(instances, userId, additionalFields) {
  let result;

  // If we gave multiple instances, do it for each one
  if (Array.isArray(instances)) {
    result = Promise.all(
      instances.map(async instance =>
        addFields(instance, userId, additionalFields)
      )
    );
  } else {
    let instance = { ...instances };
    result = await addFields(instance, userId, additionalFields);
  }

  return result;
}

async function addFields(instance, userId, additionalFields) {
  let modifiedInstance = { ...instance };

  for (let key in additionalFields) {
    let additionalFieldName = key;
    let additionalFieldValue = await (async () =>
      additionalFields[key](userId, instance))();

    modifiedInstance = {
      ...modifiedInstance,
      [additionalFieldName]: additionalFieldValue
    };
  }

  return modifiedInstance;
}
