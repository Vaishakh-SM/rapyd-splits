import { Router } from "express";
import prisma from "../db/prisma";
import { AuthenticatedRequest } from "src/types/req";
import { checkIfAuthenticated } from "../middleware/middleware";

const router = Router();
router.use(checkIfAuthenticated);
router.get("/ewallets", async (req: AuthenticatedRequest, res) => {
  try {
    const profile = await prisma.user.findUnique({
      where: { uid: req.userId },
    });
    if (profile === null) {
      throw Error("User not found");
    }
    res.send(profile.eWallet);
  } catch (e) {
    console.log("Error during signin, profile finding/creation", e);
    res.status(500).send(e);
  }
});

router.post("/ewallet", async (req: AuthenticatedRequest, res) => {
  try {
    const ids = await prisma.user.findUnique({
      where: { uid: req.userId },
      select: {
        eWallet: true,
      },
    });
    if (ids?.eWallet.includes(req.body.id)) {
		res.status(500).send({"error": "EWalletID already exists on your account"});
		return
    }
    await prisma.user.update({
      where: {
        uid: req.userId,
      },
      data: {
        eWallet: {
          push: req.body.id,
        },
      },
    });
    res.send({ status: "success" });
  } catch (e) {
    console.log("Error while adding ewallet, /add/ewallet", e);
    res.status(500).send(e);
  }
});

router.delete("/ewallet", async (req: AuthenticatedRequest, res) => {
	  try {
		const ids = await prisma.user.findUnique({
							  where: { uid: req.userId },
							  select: {
								eWallet: true,
							  },
							});
		if (!ids?.eWallet.includes(req.body.id)) {
			res.status(500).send({"error": "EWalletID does not exist on your account"});
		}
		await prisma.user.update({
				where: {
					uid: req.userId,
				},
				data: {
					eWallet: {
						set: ids?.eWallet.filter((id) => id !== req.body.id),
					},
				},
			});
		res.send({ status: "success" });
		} catch (e) {
			console.log("Error while adding ewallet, /add/ewallet", e);
			res.status(500).send(e);
		}
});

export default router;
