const fetch = require("node-fetch");

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
  const userURL = `${process.env.AUTH0_OAUTH2_AUDIENCE}users`;
  const users = await requestWithToken(userURL);
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
  const userURL = `${process.env.AUTH0_OAUTH2_AUDIENCE}users?q=user_id:${auth0_userid}`;
  const searchResults = await requestWithToken(userURL);
  return searchResults[0];
}

module.exports.getUserInfo = getUserInfo;

async function requestWithToken(url) {
  let accessToken = await getManagementAccessToken();

  const options = {
    headers: { authorization: `Bearer ${accessToken}` }
  };

  const response = await fetch(url, options);

  const body = await response.json();

  return body;
}
