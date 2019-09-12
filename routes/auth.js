const express = require("express");
const router = express.Router();
const passport = require("passport");

/* Log in with GitHub  */
router.get("/github", passport.authenticate("github"));

/* Github callback */
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

module.exports = router;
