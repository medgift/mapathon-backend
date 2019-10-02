const createError = require("http-errors");
const express = require("express");
require("express-async-errors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const jwt = require("express-jwt");
const jwks = require("jwks-rsa");
const basicAuth = require("express-basic-auth");

const poiRouter = require("./routes/poi");
const userRouter = require("./routes/user");
const statusRouter = require("./routes/status");
const categoryRouter = require("./routes/category");
const tagRouter = require("./routes/tag");
const gpxFileRouter = require("./routes/gpx-file");

const models = require("./models");

// Read environment variales
require("dotenv").config();

const app = express();

// CORS
app.use(cors());

// set up JWT checking
const authConfig = {
  domain: "mapathon.eu.auth0.com",
  audience: "https://backend.mapathon.ehealth.hevs.ch"
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
app.use("/status", jwtCheck, statusRouter);
app.use("/category", jwtCheck, categoryRouter);
app.use("/tag", jwtCheck, tagRouter);
app.use("/gpx-file", jwtCheck, gpxFileRouter);

// server Swagger Doc
let uiOptions = {
  swaggerOptions: {
    //supportedSubmitMethods: []
    oauth: {
      clientId: process.env.OAUTH2_CLIENT_ID,
      clientSecret: process.env.OAUTH2_CLIENT_SECRET,
      scopeSeparator: ",",
      additionalQueryStringParams: {}
    }
  }
};

const swaggerDocument = YAML.load("./swagger.yml");

let basicAuthMiddleware = basicAuth({
  users: {
    [process.env.BASIC_AUTH_USER]: process.env.BASIC_AUTH_PASS
  },
  challenge: true
});

app.use(
  "/",
  basicAuthMiddleware,
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, uiOptions)
);

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

  let response = {
    message: err.message
  };

  console.error(err);

  res.json(response);
});

module.exports = app;
