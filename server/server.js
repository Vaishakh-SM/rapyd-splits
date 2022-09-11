require("dotenv").config({ path: "./config.env" });

const express = require("express");
const cors = require("cors");
const MongoStore = require("connect-mongo");
const { Server } = require("socket.io");
const dbo = require("./db/conn");
const http = require("http");
const crypto = require("crypto");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 4001;

var passport = require("passport");
var session = require("express-session");
var authRouter = require("./routes/auth");

app.use(cors({
	credentials: true
}));
app.use(express.json());
app.use(
  session({
    cookie: {
      maxAge: 6000 * 60, // 60 minutes
    },
    secret: process.env.SESSION_SECRET,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      collectionName: "sessions",
    }),
  })
);

app.use(require("./routes/group_payments"));
app.use(passport.initialize());
app.use(passport.session());

app.use("/", authRouter);

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
	console.log(req.user)
  if (!req.session) {
    console.log("session not authenticated");
    return res.send("respond with a resource");
  }
  console.log("User is ", req.user);
  return res.send("user" + req.session.passport.user);
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
  console.log(socket.id + " connected ");

  onCreateRoom(socket);

  onJoinRoom(socket);
});

server.listen(port, () => console.log(`Listening on port ${port}`));
