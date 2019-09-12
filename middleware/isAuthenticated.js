// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  if (!req.wantsJSON()) {
    res.redirect(301, "/auth/github");
  } else {
    res.status(401).send({ errors: [{ status: 401, title: "Unauthorized" }] });
  }
}

module.exports = isLoggedIn;
