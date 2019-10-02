const auth0UserInfo = require("../auth0/user-info");

async function formatInstancesWithCreator(instances) {
  let usersById = await auth0UserInfo.getAllUsersById();

  let decorateInstancesPromises = instances.map(instance =>
    formatInstanceWithCreator(instance, usersById[instance.creatorId])
  );

  let decoratedInstances = await Promise.all(decorateInstancesPromises);

  return decoratedInstances;
}

module.exports.formatInstancesWithCreator = formatInstancesWithCreator;

function formatInstanceWithCreator(instance, creator) {
  let plainInstance = instance.get({ plain: true });
  delete plainInstance.creatorId;

  return {
    ...plainInstance,
    Creator: formatUser(creator)
  };
}

module.exports.formatInstanceWithCreator = formatInstanceWithCreator;

function formatUser(user) {
  if (user) {
    return {
      id: user.user_id,
      name: user.name,
      picture: user.picture,
      email: user.email
    };
  } else {
    return null;
  }
}

module.exports.formatUser = formatUser;
