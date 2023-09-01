import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from "@eztik/common";
import express, { Request, Response } from "express";
import { Order } from "../models/order";
const paypal = require("paypal-rest-sdk");
import { create_payment_json } from "../config/paypal";

const router = express.Router();

router.get("/api/payments/success", (req: Request, res: Response) => {
  // publish event charged successfull
  const paymentId = req.query.paymentId;
  console.log("payment success with id : ", paymentId);
  res.send("payment success ");
});

router.get("/api/payments/failed", (req: Request, res: Response) => {
  // publish event charged failed
  res.send("payment failed");
});

router.post(
  "/api/payments",
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.body;
    console.log(orderId);
    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Can not pay for an cancelled order ");
    }

    const paypalJson = create_payment_json(order.title, order.price);
    const paypalString = await JSON.parse(paypalJson);

    //@ts-ignore
    await paypal.payment.create(paypalString, function (error: Error, payment) {
      if (error) {
        throw error;
      } else {
        console.log(payment.links);
        for (let i = 0; i < payment.links!.length; i++) {
          if (payment.links![i].rel === "approval_url") {
            res.redirect(payment.links![i].href);
          }
        }
      }
    });
  }
);

router.get("/api/payments/all-orders", async (req, res) => {
  const orders = await Order.find({});
  res.send(orders);
});

export { router as createChargeRouter };
