require('dotenv').config({ path: './config.env' });

const express = require("express");
const cors = require("cors");
const {Server} = require("socket.io")

const dbo = require('./db/conn')
const http = require('http')

const app = express();
app.use(cors());
app.use(express.json());
app.use(require('./routes/group_payments'))

const server = http.createServer(app);

const port = process.env.PORT || 4001;

const crypto = require("crypto")

// const io = socketIo(server, {
//   cors: { origin: "*" },
// });
const io = new Server(server)

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
