import { Express, Router } from "express";
import prisma from "../db/prisma";
import { AuthenticatedRequest } from "src/types/req";
import { checkIfAuthenticated } from "../middleware/middleware";

const router = Router();
router.use(checkIfAuthenticated);
router.get("/signin", async (req: AuthenticatedRequest, res) => {
  try {
    console.log("Uid is ", req.userId);
    const profile = await prisma.user.findUnique({
      where: { uid: req.userId },
    });
    console.log("profile is ", profile);
    if (profile === null) {
      await prisma.user.create({ data: { uid: req.userId as string } });
      res.send({ uid: req.userId });
    } else {
      res.send({ uid: req.userId });
    }
  } catch (e) {
    console.log("Error during signin, profile finding/creation", e);
    res.send(e);
  }
});

export default router;
