var express = require("express");
var router = express.Router();
const auth0UserInfo = require("../auth0/user-info");
const errorHandler = require("../utils/error-handler");
const formatUser = require("../utils/format-user");

router.get("/", async function(req, res, next) {
  let users = await auth0UserInfo.getAllUsers();

  let formattedUsers = users.map(user => formatUser(user));

  res.send(formattedUsers);
});

router.get("/:id", async function(req, res, next) {
  let user = await auth0UserInfo.getUserInfo(req.params.id);

  if (!user) {
    return errorHandler.sendNotFound(res);
  }

  res.send(formatUser(user));
});

module.exports = router;
