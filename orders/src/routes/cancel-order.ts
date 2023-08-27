import { requireAuth, OrderStatus } from "@eztik/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";

const router = express.Router();

router.delete(
  "/api/orders::id",
  requireAuth,
  [
    body("ticketId")
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Ticket Id mus be provided"),
  ],
  async (req: Request, res: Response) => {
    res.send({});
  }
);

export { router as cancelOrderRouter };
