var express = require("express");
const mongoose = require("mongoose");
var passport = require("passport");
var GithubStrategy = require("passport-github");
var createUser = require("../schemas/user");

User = createUser(mongoose);
mongoose.connect(process.env.MONGO_URL);

passport.use(
  new GithubStrategy(
    {
      clientID: process.env["GITHUB_CLIENT"],
      clientSecret: process.env["GITHUB_SECRET"],
      callbackURL: process.env.AUTH_REDIRECT,
      state: true,
    },
    async function verify(accessToken, refreshToken, profile, cb) {
      user = {
        id: profile.id,
        username: profile.username,
      };

      try {
        const userExists = await User.exists({ id: profile.id });
        if (userExists) {
          cb(null, user);
        } else {
          var newUser = new User({
            id: profile.id,
            username: profile.username,
          });

          newUser.save();

          cb(null, user);
        }
      } catch (err) {
        console.log("Errored during user querying", err);
        cb(null, false);
      }
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

// router.get("/login", function (req, res, next) {
//   //   res.render("login");
//   res.send("lol");
// });

router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

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
