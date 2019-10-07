const fetch = require("node-fetch");
const cache = require("./cache");

async function getManagementAccessToken() {
  const managementURL = process.env.AUTH0_OAUTH2_TOKEN_URL;

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.AUTH0_OAUTH2_CLIENT_ID,
      client_secret: process.env.AUTH0_OAUTH2_CLIENT_SECRET,
      audience: process.env.AUTH0_OAUTH2_AUDIENCE,
      grant_type: process.env.AUTH0_OAUTH2_GRANT_TYPE
    })
  };

  let response = await fetch(managementURL, options);

  let responseBody = await response.json();

  return responseBody["access_token"];
}

async function getAllUsers() {
  let users = cache.get("/users");

  if (users === undefined) {
    const userURL = `${process.env.AUTH0_OAUTH2_AUDIENCE}users`;
    users = await requestWithToken(userURL);

    const usersGroup = await getUsersGroup();

    users = users.map(user => ({ ...user, group: usersGroup[user.user_id] }));

    cache.set("/users", users);
  }

  return users;
}

module.exports.getAllUsers = getAllUsers;

async function getAllUsersById() {
  const users = await getAllUsers();

  const usersById = users.reduce((accumulator, user) => {
    accumulator[user.user_id] = user;
    return accumulator;
  }, {});

  return usersById;
}

module.exports.getAllUsersById = getAllUsersById;

async function getUserInfo(auth0_userid) {
  let user = cache.get(`/users/${auth0_userid}`);

  if (user === undefined) {
    const userURL = `${process.env.AUTH0_OAUTH2_AUDIENCE}users?q=user_id:${auth0_userid}`;
    const searchResults = await requestWithToken(userURL);

    let userGroup = await getUserGroup(auth0_userid);

    user = { ...searchResults[0], group: userGroup };

    cache.set(`/users/${auth0_userid}`, user);
  }

  return user;
}

module.exports.getUserInfo = getUserInfo;

async function getUsersGroup() {
  const roleIDs = [
    "rol_ZFNAjXGVZQJ83VOi",
    "rol_60vcXwQTdb4d2pGc",
    "rol_jS9esdLkYG4VtSUh",
    "rol_KJG2Le1YuUcR7ap9",
    "rol_lHghYL0NUpTM5tRm"
  ];

  const roleURLs = roleIDs.map(
    roleID => `${process.env.AUTH0_OAUTH2_AUDIENCE}roles/${roleID}/users`
  );

  const rolesWithUsers = await Promise.all(
    roleURLs.map(roleURL => requestWithToken(roleURL))
  );

  const userGroupMap = rolesWithUsers.reduce(
    (userGroupMap, roleUsers, groupIndex) => {
      roleUsers.map(user => {
        userGroupMap[user.user_id] = groupIndex;
      });

      return userGroupMap;
    },
    {}
  );

  return userGroupMap;
}

async function getUserGroup(auth0_userid) {
  const roleURL = `${process.env.AUTH0_OAUTH2_AUDIENCE}users/${auth0_userid}/roles`;

  const userRoles = await requestWithToken(roleURL);

  let groupID;
  if (userRoles.length > 0) groupID = +userRoles[0].name.replace("Group ", "");

  return groupID;
}

async function requestWithToken(url) {
  let accessToken = await getManagementAccessToken();

  const options = {
    headers: { authorization: `Bearer ${accessToken}` }
  };

  const response = await fetch(url, options);

  const body = await response.json();

  return body;
}
