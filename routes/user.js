var express = require("express");
var router = express.Router();
const auth0UserInfo = require("../auth0/user-info");

router.get("/", async function(req, res, next) {
  let users = await auth0UserInfo.getAllUsers();

  res.send(users);
});

module.exports = router;
