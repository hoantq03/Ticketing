import {
  Listener,
  NotFoundError,
  OrderCanceledEvent,
  Subjects,
} from "@eztik/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";

export class OrderCanceledListener extends Listener<OrderCanceledEvent> {
  readonly subject = Subjects.OrderCanceled;
  readonly queueGroupName = queueGroupName;
  async onMessage(data: OrderCanceledEvent["data"], msg: Message) {
    const { id, version, ticket } = data;

    //find the ticket which is want to cancel reserved
    const ticketUpdated = await Ticket.findById(ticket.id);

    if (!ticketUpdated) {
      throw new NotFoundError();
    }
    //delete the order id
    ticketUpdated.orderId = undefined;
    ticketUpdated.version++;

    // save the ticket
    await ticketUpdated.save();

    //call updated publisher
    new TicketUpdatedPublisher(this.client).publish({
      id: ticketUpdated.id,
      price: ticketUpdated.price,
      title: ticketUpdated.title,
      userId: ticketUpdated.userId,
      version: ticketUpdated.version,
      orderId: ticketUpdated.orderId,
    });
    //call ack function
    msg.ack();
  }
}
