import { NextFunction, Request, Response } from "express";
import prisma from "../db/prisma";
import { Middleware } from "src/types/middleware";
import { AuthenticatedRequest } from "src/types/req";

import admin from "../config/firebase-config";

// export interface IGetAuthTokenRequest extends Request {
//   authToken: string;
//   authId: string;
// }

const getAuthToken: Middleware = (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    req.authToken = req.headers.authorization.split(" ")[1];
  } else {
    req.authToken = "";
  }
  next();
};

export const checkIfAuthenticated: Middleware = (req, res, next) => {
  getAuthToken(req, res, async () => {
    try {
      const { authToken } = req;
      const userInfo = await admin.auth().verifyIdToken(authToken ?? "");
      req.userId = userInfo.uid;
      return next();
    } catch (e) {
      return res
        .status(401)
        .send({ error: "You are not authorized to make this request" });
    }
  });
};

export const checkIfRegisteredUser: Middleware = async (req, res, next) => {
  const profile = await prisma.user.findUnique({
    where: { uid: req.userId },
  });

  if (profile === null) {
    return res.status(401).send({ error: "You are not registered" });
  } else {
    next();
  }
};

export const checkIfAdmin: Middleware = (req, res, next) => {
  getAuthToken(req, res, async () => {
    try {
      const userInfo = await admin.auth().verifyIdToken(req.authToken ?? "");
      if (userInfo.admin === true) {
        req.userId = userInfo.uid;
        return next();
      }
    } catch (e) {
      return res
        .status(401)
        .send({ error: "You are not authorized to make this request" });
    }
  });
};
