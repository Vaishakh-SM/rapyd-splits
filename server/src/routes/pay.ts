import { Router } from "express";
import { AuthenticatedRequest } from "src/types/req";

const router = Router();

const transactionStore = new Map<string, []>();

router.post("/addpayment", (req, res) => {});
