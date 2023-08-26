import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@eztik/common";
import { body } from "express-validator";
import mongoose from "mongoose";

const router = express.Router();

router.delete(
  "/api/orders::id",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Ticket Id mus be provided"),
  ],
  async (req: Request, res: Response) => {
    res.send({});
  }
);

export { router as cancelOrderRouter };
