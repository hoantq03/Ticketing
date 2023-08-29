import {
  Listener,
  NotFoundError,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@eztik/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    //find the ticket that the order reserving
    const ticket = await Ticket.findById(data.ticket.id);

    //if no ticket, throw error
    if (!ticket) {
      throw new NotFoundError();
    }

    //mark the ticket as being reserved by setting its orderIs property
    ticket.orderId = data.id;

    //save the ticket
    await ticket.save();

    //ack the message
    msg.ack();
  }
}
