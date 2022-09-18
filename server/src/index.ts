import "dotenv/config";

import express from "express";
import cors from "cors";
import http from "http";

import bodyParser from "body-parser";

import prisma from "./db/prisma";
import roomRoute from "./routes/room";
import authRoute from "./routes/auth";
import userRoute from "./routes/user";
import useSocketPath from "./socket.js";

const port = process.env.PORT || 4001;

const app = express();
app.use(
  cors({ origin: "http://localhost:5173", credentials: true, methods: ["*"] })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const server = http.createServer(app);

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  prisma.$disconnect();
  server.close(() => {
    console.log("HTTP server closed");
  });
});

app.use("/api/room", roomRoute);
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
useSocketPath(server);

// const root = "/home/vaishakh/Desktop/Projects/Rapyd/client/dist";
const root = require("path").join(__dirname, "..", "..", "client", "dist");

app.use(express.static(root));

app.get("/*", (req, res) => {
  res.sendFile(
    require("path").join(__dirname, "..", "..", "client", "dist", "index.html")
  );
});

server.listen(port, () => console.log(`Listening on port ${port}`));
