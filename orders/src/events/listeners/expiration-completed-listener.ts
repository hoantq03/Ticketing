import {
  ExpirationCompletedEvent,
  Listener,
  NotFoundError,
  OrderStatus,
  Subjects,
} from "@eztik/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";
import { OrderCanceledPublisher } from "../publishers/order-created-publisher";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/ticket";

export class ExpirationCompletedListener extends Listener<ExpirationCompletedEvent> {
  readonly subject = Subjects.ExpirationCompleted;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompletedEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    new OrderCanceledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
      version: order.ticket.version,
    });

    msg.ack();
  }
}
