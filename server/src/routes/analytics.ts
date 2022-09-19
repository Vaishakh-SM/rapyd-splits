import { Express, Router } from "express";
import { Double } from "mongodb";
import prisma from "../db/prisma";
import {
  checkIfAuthenticated,
  checkIfRegisteredUser,
} from "../middleware/middleware";
import { AuthenticatedRequest } from "src/types/req";
import dayjs from "dayjs";

const router = Router();

router.get("/data", async (req: AuthenticatedRequest, res) => {
  const roomNumber = await prisma.room.count({
    where: {
      userId: req.userId,
    },
  });

  const totalAmount = await prisma.room.aggregate({
    where: {
      userId: req.userId,
    },
    _sum: {
      amount: true,
    },
  });

  var past_x_days = 10 * 86400000;

  const detailed = await prisma.room.aggregateRaw({
    pipeline: [
      {
        $match: {
          $expr: {
            $gt: [
              { $toDate: "$_id" },
              { $toDate: dayjs().subtract(past_x_days, "ms").toISOString() },
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            dateYMD: {
              $dateFromParts: {
                year: { $year: "$_id" },
                month: { $month: "$_id" },
                day: { $dayOfMonth: "$_id" },
              },
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.dateYMD": 1 },
      },
      {
        $project: {
          _id: 0,
          count: 1,
          name: {
            $dateToString: { date: "$_id.dateYMD", format: "%d-%m-%Y" },
          },
        },
      },
    ],
  });

  res.send({
    roomNumber,
    totalAmount,
    detailed,
  });
});

export default router;
