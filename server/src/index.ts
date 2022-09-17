import "dotenv/config";

import express, { Request, response } from "express";
import cors from "cors";
import http from "http";
import crypto from "crypto";

import bodyParser from "body-parser";
import { checkIfAuthenticated } from "./middleware/middleware.js";
import { AuthenticatedRequest } from "src/types/req";
import admin from "./config/firebase-config";
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

app.get("/", (req, res) => {
  res.send("Hello");
});

server.listen(port, () => console.log(`Listening on port ${port}`));
