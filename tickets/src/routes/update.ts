import {
  NotAuthorizedError,
  NotFoundError,
  RequestValidationError,
  requireAuth,
  validateRequest,
} from "@eztik/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  requireAuth,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser?.id) {
      throw new NotAuthorizedError();
    }

    ticket.title = req.body.title;
    ticket.price = req.body.price;

    await ticket.save();

    res.status(200).send(ticket);
  }
);

export { router as UpdateTicketRouter };
