import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import { NotFoundError } from "@eztik/common";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
  const tickets = await Ticket.find();
  res.status(200).send(tickets);
});

router.get("/api/tickets/:ticketId", async (req: Request, res: Response) => {
  const ticketId = req.params.ticketId;
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new NotFoundError();
  }
  res.status(200).send(ticket);
});

export { router as showTicketRouter };
