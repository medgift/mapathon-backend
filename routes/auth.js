const express = require("express");
const router = express.Router();
const passport = require("passport");

/* Log in with GitHub  */
router.get("/github", passport.authenticate("github", { session: false }));

/* Github callback */
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/", session: false }),
  function(req, res) {
    // Successful authentication, redirect home and set cookie with JWT.
    res.redirect("/");
  }
);

module.exports = router;
