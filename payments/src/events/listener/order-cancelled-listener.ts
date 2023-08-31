import {
  Listener,
  NotFoundError,
  OrderCanceledEvent,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@eztik/common";
import { queueGroupNme } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCanceledEvent> {
  readonly subject = Subjects.OrderCanceled;
  readonly queueGroupName = queueGroupNme;
  async onMessage(data: OrderCanceledEvent["data"], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });
    if (!order) {
      throw new NotFoundError();
    }

    order.set({ status: OrderStatus.Cancelled });

    await order.save();

    msg.ack();
  }
}
