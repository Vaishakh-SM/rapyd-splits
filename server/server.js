require("dotenv").config({ path: "./config.env" });

const express = require("express");
const cors = require("cors");
const MongoStore = require("connect-mongo");
const { Server } = require("socket.io");
const dbo = require("./db/conn");
const http = require("http");
const app = express();
const server = http.createServer(app);
const crypto = require("crypto");
const io = new Server(server);
const port = process.env.PORT || 4001;

var passport = require("passport");
var session = require("express-session");
var authRouter = require("./routes/auth");

// const io = socketIo(server, {
//   cors: { origin: "*" },
// });

app.use(cors());
app.use(express.json());
app.use(
  session({
    cookie: {
      maxAge: 6000 * 5, // see below
    },
    secret: "Patti sinan",
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      collectionName: "sessions",
    }),
  })
);

app.use(require("./routes/group_payments"));
// app.use(passport.authenticate("session"));
app.use(passport.initialize());
app.use(passport.session());

app.use("/", authRouter);

app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

// perform a database connection when the server starts
dbo.connectToServer(function (err) {
  if (err) {
    console.error(err);
    process.exit();
  }

  // start the Express server
  // app.listen(port, () => {
  //   console.log(`Server is running on port: ${port}`);
  // });
});

app.get("/users", (req, res) => {
  if (!req.session.passport || !req.session.passport.user) {
    console.log("session not authenticated");
    return res.send("respond with a resource");
  }
  console.log(req.session.passport.user);
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
