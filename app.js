const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const swaggerDoc = require("./swagger-doc");
const cors = require("cors");
const session = require("express-session");

const authRouter = require("./routes/auth");
const poiRouter = require("./routes/poi");
const userRouter = require("./routes/user");

const isAuthenticated = require("./middleware/isAuthenticated");
const wantsJSON = require("./middleware/wantsJSON");

const models = require("./models");

// Read environment variales
require("dotenv").config();

const app = express();

// CORS
app.use(cors());

// Wants JSON
app.use((req, res, next) => {
  req.wantsJSON = wantsJSON;
  next();
});

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

// passport setup
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/github/callback",
      scope: ["user"]
    },
    async function(accessToken, refreshToken, profile, done) {
      try {
        let [user, created] = await models.User.findOrCreate({
          where: { githubId: profile.id }
        });
        return done(undefined, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Facebook profile is serialized
// and deserialized.
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/auth", authRouter);

app.use(isAuthenticated);
app.use("/poi", poiRouter);
app.use("/users", userRouter);

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
