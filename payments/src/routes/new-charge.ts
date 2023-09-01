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
import { order } from "paypal-rest-sdk";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publisher/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.get(
  "/api/payments/success",
  requireAuth,
  async (req: Request, res: Response) => {
    // publish event charged successfull
    const paymentId = req.query.paymentId?.toString();
    const orderId = req.query.orderId?.toString();

    if (!paymentId || !orderId) {
      throw new NotAuthorizedError();
    }
    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }

    const payment = Payment.build({
      orderId: orderId,
      paypalId: paymentId,
    });
    order.status = OrderStatus.Complete;

    await order.save();
    await payment.save();

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: paymentId,
      orderId: orderId,
    });

    res.status(401).send({ paymentId: paymentId });
  }
);

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

    const paypalJson = create_payment_json(order.title, order.price, order.id);
    const paypalString = await JSON.parse(paypalJson);

    await paypal.payment.create(
      paypalString,
      //@ts-ignore
      function (error: Error, payment, orderId: string) {
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
      }
    );
  }
);

router.get("/api/payments/all-orders", async (req, res) => {
  const orders = await Order.find({});
  res.send(orders);
});

export { router as createChargeRouter };
