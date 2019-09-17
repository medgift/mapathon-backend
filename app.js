const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const swaggerDoc = require("./swagger-doc");
const cors = require("cors");
const jwt = require("express-jwt");
const jwks = require("jwks-rsa");

const poiRouter = require("./routes/poi");
const userRouter = require("./routes/user");

const models = require("./models");

// Read environment variales
require("dotenv").config();

const app = express();

// CORS
app.use(cors());

// set up JWT checking

const authConfig = {
  domain: "dev-mapathon.eu.auth0.com",
  audience: "https://mapathon.ehealth.hevs.ch"
};

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 10,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
  }),
  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithms: ["RS256"]
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/poi", jwtCheck, poiRouter);
app.use("/user", jwtCheck, userRouter);

// set up swagger doc
swaggerDoc(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
