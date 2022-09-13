require("dotenv").config({ path: "./config.env" });

const express = require("express");
const cors = require("cors");
const MongoStore = require("connect-mongo");
const { Server } = require("socket.io");
const dbo = require("./db/conn");
const http = require("http");
const crypto = require("crypto");
const mongoose = require("mongoose");

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const port = process.env.PORT || 4001;

var session = require("express-session");
var cookieSession = require("cookie-session");
var createUser = require("./schemas/user");
var GithubStrategy = require("passport-github2");
var passport = require("passport");

const app = express();
app.use(
  cors({ origin: "http://localhost:5173", credentials: true, methods: ["*"] })
);

app.use(cookieParser("foo"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  session({
    cookie: {
      maxAge: 6000 * 120,
      secure: false,
      // 60 minutes
    },
    secret: "foo",
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      collectionName: "sessions",
    }),
    saveUninitialized: false,
    resave: false,
  })
);

// app.use(
//   cookieSession({
//     name: "session",
//     maxAge: 6000 * 60,
//     keys: ["foo"],
//   })
// );

app.use(require("./routes/group_payments"));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

User = createUser(mongoose);

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

passport.serializeUser((user, done) => {
  console.log("Serialized with gtihub id: ", user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log("Desialised Id is ", id);
  User.findOne({ id: id }, (err, user) => {
    if (err) {
      console.log("Errored out in deserialization", err);

      done(null, false, { error: err });
    } else {
      console.log("Deserialized user is ", user);
      done(null, user);
    }
  });
});

// app.use(function (req, res, next) {
//   res.locals.user = req.user;
//   next();
// });

var authRouter = require("./routes/auth");
app.use("/", authRouter);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["*"],
  },
});
// perform a database connection when the server starts
dbo.connectToServer(function (err) {
  if (err) {
    console.error(err);
    process.exit();
  }
});

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/users", (req, res) => {
  if (req.isAuthenticated()) {
    console.log("req is ", req);
    console.log("User is ", req.user);

    return res.send(req.user);
  }
  console.log("session not authenticated");
  return res.send("respond with a resource");
});

const roomStore = new Set();

function onCreateRoom(socket) {
  socket.on("create-room", () => {
    let roomId = crypto.randomBytes(16).toString("hex").substring(0, 8);

    while (roomStore.has(roomId))
      roomId = crypto.randomBytes(16).toString("hex").substring(0, 8);

    roomStore.add(roomId);
    // TESTING SOCKET, CHANGE MAP TO SET OR WHATEVER

    socket.join(roomId);
    io.to(roomId).emit("create-room-success", roomId);
  });
}

function onJoinRoom(socket) {
  socket.on("join-room", (roomId) => {
    console.log("Room id: ", roomId, "Room store ", roomStore);
    console.log("Roomstore has", roomStore.has(roomId));
    console.log("Type of roomid is", typeof roomId);
    if (roomStore.has(roomId)) {
      console.log("Yes it worked");

      console.log("socket id is ", socket.id);
      io.to(socket.id).emit("join-room-success", roomId);
      socket.join(roomId);

      io.to(roomId).emit("new-join");
    } else {
      io.to(socket.id).emit("join-room-fail");
    }
  });
}

io.on("connection", (socket) => {
  // console.log(socket.id + " connected ");

  onCreateRoom(socket);

  onJoinRoom(socket);
});

server.listen(port, () => console.log(`Listening on port ${port}`));
