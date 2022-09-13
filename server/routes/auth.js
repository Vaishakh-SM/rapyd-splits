var express = require("express");
const mongoose = require("mongoose");
var passport = require("passport");
var GithubStrategy = require("passport-github2");
var createUser = require("../schemas/user");

// mongoose.connect(process.env.MONGO_URL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// User = createUser(mongoose);

// passport.use(
//   new GithubStrategy(
//     {
//       clientID: process.env["GITHUB_CLIENT"],
//       clientSecret: process.env["GITHUB_SECRET"],
//       callbackURL: process.env.AUTH_REDIRECT,
//       state: true,
//     },
//     async function verify(accessToken, refreshToken, profile, cb) {
//       user = {
//         id: profile.id,
//         username: profile.username,
//       };

//       try {
//         const userExists = await User.exists({ id: profile.id });
//         if (userExists) {
//           cb(null, user);
//         } else {
//           var newUser = new User({
//             id: profile.id,
//             username: profile.username,
//           });

//           newUser.save();

//           cb(null, user);
//         }
//       } catch (err) {
//         console.log("Errored during user querying", err);
//         cb(null, false);
//       }
//     }
//   )
// );

// passport.serializeUser(function (user, cb) {
//   process.nextTick(function () {
//     cb(null, { id: user.id, username: user.username });
//   });
// });

// passport.deserializeUser(function (user, cb) {
//   process.nextTick(function () {
//     cb(null, user);
//   });
// });

// Try executing these 2 in server.js
// passport.serializeUser((user, done) => {
//   console.log("Serialized with gtihub id: ", user.id);
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   console.log("Desialised Id is ", id);
//   User.findOne({ id: id }, (err, user) => {
//     if (err) {
//       console.log("Errored out in deserialization", err);

//       done(null, false, { error: err });
//     } else {
//       console.log("Deserialized user is ", user);
//       done(null, user);
//     }
//   });
// });

var router = express.Router();

// router.get("/login", function (req, res, next) {
//   //   res.render("login");
//   res.send("lol");
// });

router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

// router.get("/auth/github", function (req, res, next) {
//   passport.authenticate("github", function (err, user, info) {
//     if (err) {
//       console.log("errored out in auth github");
//       return next(err);
//     }
//     if (!user) {
//       return res.redirect("/login");
//     }

//     // NEED TO CALL req.login()!!!
//     console.log("Req login called for ", user);
//     req.login(user, next);
//   })(req, res, next);
// });

router.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    successReturnToOrRedirect: "/done",
    failureRedirect: "/login",
  })
);

router.get("/done", (req, res) => {
  res.redirect("http://localhost:5173/dashboard");
});

router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
