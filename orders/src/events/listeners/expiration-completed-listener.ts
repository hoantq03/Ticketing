import {
  ExpirationCompletedEvent,
  Listener,
  NotFoundError,
  OrderStatus,
  Subjects,
} from "@eztik/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";
import { natsWrapper } from "../../nats-wrapper";
import { OrderCancelledPublisher } from "../publishers/order-canceled-publisher";
import { queueGroupName } from "./queue-group-name";

export class ExpirationCompletedListener extends Listener<ExpirationCompletedEvent> {
  readonly subject = Subjects.ExpirationCompleted;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompletedEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }
    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
      version: order.ticket.version,
    });

    msg.ack();
  }
}
