const formatter = require("../utils/formatter");
const auth0UserInfo = require("../auth0/user-info");
const models = require("../models");

async function getAll(model, options) {
  const opts = options || {};

  let instances = await models[model].findAll(opts);

  let decoratedInstances = await formatter.formatInstancesWithCreator(
    instances
  );

  return decoratedInstances;
}

module.exports.getAll = getAll;

async function getInstance(model, id, options) {
  const opts = options || {};

  let instance = await models[model].findByPk(id, opts);

  if (!instance) {
    return null;
  }

  let instanceCreator = await auth0UserInfo.getUserInfo(instance.creatorId);
  let decoratedInstance = await formatter.formatInstanceWithCreator(
    instance,
    instanceCreator
  );

  return decoratedInstance;
}

module.exports.getInstance = getInstance;

async function createInstance(model, body, creatorId, options) {
  const opts = options || {};

  let instanceToCreate = body;
  instanceToCreate.creatorId = creatorId;

  let createdInstance = await models[model].create(instanceToCreate);

  let instanceCreator = await auth0UserInfo.getUserInfo(
    createdInstance.creatorId
  );
  let decoratedInstance = await formatter.formatInstanceWithCreator(
    createdInstance,
    instanceCreator
  );

  return decoratedInstance;
}

module.exports.createInstance = createInstance;

async function updateInstance(model, id, body, options) {
  const opts = options || {};

  let instanceToUpdate = await models[model].findByPk(id, opts);
  let updatedInstance = await instanceToUpdate.update(body);

  let instanceCreator = await auth0UserInfo.getUserInfo(
    updatedInstance.creatorId
  );
  let decoratedInstance = await formatter.formatInstanceWithCreator(
    updatedInstance,
    instanceCreator
  );

  return decoratedInstance;
}

module.exports.updateInstance = updateInstance;

async function deleteInstance(model, id, options) {
  const opts = options || {};

  let instanceToDelete = await models[model].findByPk(id, opts);

  let deletedInstance = await instanceToDelete.destroy();

  let instanceCreator = await auth0UserInfo.getUserInfo(
    instanceToDelete.creatorId
  );
  let decoratedInstance = await formatter.formatInstanceWithCreator(
    instanceToDelete,
    instanceCreator
  );

  return decoratedInstance;
}

module.exports.deleteInstance = deleteInstance;
