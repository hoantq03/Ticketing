import { NotAuthorizedError, NotFoundError, requireAuth } from "@eztik/common";
import express, { Request, Response } from "express";
import { Order } from "../models/orders";

const router = express.Router();

router.get(
  "/api/orders/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const order = await Order.findById(id).populate("ticket");
    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.status(200).send(order);
  }
);

export { router as orderDetailRouter };
