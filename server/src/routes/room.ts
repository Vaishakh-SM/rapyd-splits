import { Express, Router } from "express";
import { Double } from "mongodb";
import prisma from "src/db/prisma";
import { AuthenticatedRequest } from "src/types/req";

const router = Router();

router.get("/create", async (req: AuthenticatedRequest, res) => {
  try {
    const room = await prisma.room.create({
      data: {
        eWallet: req.query.ewallet as string,
        amount: parseFloat(req.query.amount as string),
        userId: req.userId!,
        status: "PENDING",
      },
    });

    res.send({ id: room.id });
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
