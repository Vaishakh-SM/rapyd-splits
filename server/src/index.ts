import "dotenv/config";

import express, { Request } from "express";
import cors from "cors";
import { Server, Socket } from "socket.io";
import { connectToServer } from "./db/conn";
import http from "http";
import crypto from "crypto";

import bodyParser from "body-parser";
import { checkIfAuthenticated } from "./middleware/middleware.js";
import { AuthenticatedRequest } from "src/types/req";
import admin from "./config/firebase-config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const port = process.env.PORT || 4001;

const app = express();
app.use(
  cors({ origin: "http://localhost:5173", credentials: true, methods: ["*"] })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["*"],
  },
});
// perform a database connection when the server starts
prisma.$connect();

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  prisma.$disconnect();
  server.close(() => {
    console.log("HTTP server closed");
  });
});

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get(
  "/users",
  checkIfAuthenticated,
  async (req: AuthenticatedRequest, res) => {
    console.log("Req auth id is ", req.authId);
    let profile = await admin.auth().getUser(req?.authId ?? "");
    res.send(profile);
  }
);

app.get("/create", async (req, res) => {
  const user = await prisma.user.create({
    data: {
      uid: crypto.randomBytes(16).toString("hex").substring(0, 8),
    },
  });
  res.send(user);
});

const roomStore = new Set();

function onCreateRoom(socket: Socket) {
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

function onJoinRoom(socket: Socket) {
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
