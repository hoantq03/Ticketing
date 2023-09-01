import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from "@eztik/common";
import express, { Request, Response } from "express";
import { OrderCancelledPublisher } from "../events/publishers/order-canceled-publisher";
import { Order } from "../models/orders";
import { natsWrapper } from "../nats-wrapper";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.delete(
  "/api/orders/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const order = await Order.findById(id).populate("ticket");
    if (!order) {
      throw new NotFoundError();
    }

    const ticket = await Ticket.findById(order.ticket.id);

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    order.status = OrderStatus.Cancelled;
    order.ticket.version++;

    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.ticket.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(204).send();
  }
);

export { router as cancelOrderRouter };
