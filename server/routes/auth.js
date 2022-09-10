var express = require("express");
const mongoose = require("mongoose");
var passport = require("passport");
var GithubStrategy = require("passport-github");
var createUser = require("../schemas/user");

User = createUser(mongoose);

passport.use(
  new GithubStrategy(
    {
      clientID: process.env["GITHUB_CLIENT"],
      clientSecret: process.env["GITHUB_SECRET"],
      callbackURL: process.env["AUTH_REDIRECT"],
      state: true,
    },
    function verify(accessToken, refreshToken, profile, cb) {
      console.log("Profile id is ", profile.id);

      user = {
        id: profile.id,
      };

      cb(null, user);
    }
  )
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.username, name: user.name });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

var router = express.Router();

router.get("/login", function (req, res, next) {
  //   res.render("login");
  res.send("lol");
});

router.get("/login/federated/github", passport.authenticate("github"));

router.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    successReturnToOrRedirect: "/",
    failureRedirect: "/login",
  })
);

router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
