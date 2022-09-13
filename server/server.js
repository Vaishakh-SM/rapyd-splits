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
const { checkIfAuthenticated } = require("./middleware/middleware.js");

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

app.use(require("./routes/group_payments"));

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

app.get("/users", checkIfAuthenticated, (req, res) => {
  console.log("Req auth id is ", req.authId);
  res.send("Done!");
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
