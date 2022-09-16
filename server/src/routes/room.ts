import { Express, Router } from "express";
import { Double } from "mongodb";
import prisma from "../db/prisma";
import {
  checkIfAuthenticated,
  checkIfRegisteredUser,
} from "../middleware/middleware";
import { AuthenticatedRequest } from "src/types/req";

const router = Router();

router.get("/create", async (req: AuthenticatedRequest, res) => {
  try {
    const profile = await prisma.user.findUnique({
      where: { uid: req.query.userId as string },
    });

    if (profile === null) {
      return res.status(401).send({ error: "You are not registered" });
    }
  } catch (e) {
    console.log("Errored during room creation, perhaps invalid user id", e);
  }

  try {
    const room = await prisma.room.create({
      data: {
        eWallet: req.query.ewallet as string,
        amount: parseFloat(req.query.amount as string),
        user: {
          connect: {
            uid: req.query.userId as string,
          },
        },
        status: "PENDING",
      },
    });

    // FOR TESTING

    res.redirect(
      process.env.NODE_ENV === "development"
        ? `http://localhost:5173/room/${room.id}`
        : `/room/${room.id}`
    );
  } catch (e) {
    console.log("Errored during room creation: ", e);
    res.send(e);
  }
});

export default router;
