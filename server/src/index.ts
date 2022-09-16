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
import createRoute from "./routes/auth";

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

app.use("/create", createRoute);

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


server.listen(port, () => console.log(`Listening on port ${port}`));
