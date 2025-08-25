const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");

const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const helmet = require("helmet");

const api = require("./routes/apiVersion1");

const config = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  COOKIE_KEY_1: process.env.COOKIE_KEY_1,
  COOKIE_KEY_2: process.env.COOKIE_KEY_2,
};

const AUTH_OPTIONS = {
  callbackURL: "/auth/google/callback",
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
};

const app = express();

app.use(helmet());

// app.use(
//   expressSession({
//     secret: "secret",
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       sameSite: "true", // or 'none' + secure:true (if using HTTPS)
//       secure: true,
//       httpOnly: true,
//     },
//   })
// );

app.use(
  cookieSession({
    name: "session",
    maxAge: 24 * 60 * 60 * 1000,
    keys: [config.COOKIE_KEY_1, config.COOKIE_KEY_2],
  })
);
app.use(passport.initialize());
// authenticates the session sent ot server
app.use(passport.session());

function verifyCallback(accessToken, refreshToken, profile, done) {
  done(null, profile);
}

passport.use(new GoogleStrategy(AUTH_OPTIONS, verifyCallback));

// save the session to the cookie
passport.serializeUser((user, done) => {
  done(null, user.id);
});
// read the session from the cookie
passport.deserializeUser((user, done) => {
  done(null, user);
});

//   login logout
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/signin",
    session: true,
  }),
  (req, res) => {
    console.log("auth success", req.user);
    res.redirect("/");
  }
);

app.get("/auth/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) return next(err);
    // res.clearCookie("connect.sid");
    return res.redirect("/");
  });
});

// req.user
function checkLoggedIn(req, res, next) {
  const isLoggedIn = req.isAuthenticated && req.user;
  if (!isLoggedIn) {
    return res.status(401).json({
      error: "You must log in",
    });
  }
  next();
}
app.get("/authenticate", checkLoggedIn, (req, res) => {
  res.json({ secret: "secretKeyReturned", user: req.user });
});
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("combined"));

app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/v1", api);

app.get("/failure", (req, res) => {
  return res.send("Authentication failed");
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
