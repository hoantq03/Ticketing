import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from "@eztik/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Ticket } from "../models/ticket";
import { Order } from "../models/orders";

const EXPIRATION_WINDOW_SECONDS = 15 * 60;
const router = express.Router();

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .isEmpty()
      .custom((input: string) => {
        mongoose.Types.ObjectId.isValid(input);
      })
      .withMessage("TicketId mus be provided"),
  ],
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // const tic = Ticket.build({
    //   title: "concert",
    //   price: 20,
    // });
    // await tic.save();

    // find the ticket the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }
    // make sure this ticket is not already reserved
    const existingOrder = await ticket.isReserved();

    if (existingOrder) {
      throw new BadRequestError("Ticket is already reserved");
    }

    // calculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);
    // build the order and save it to the database

    const order = Order.build({
      ticket,
      userId: req.currentUser!.id,
      expiresAt: expiration,
      status: OrderStatus.Created,
    });
    await order.save();
    //publish the order event saying that an order was created

    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
