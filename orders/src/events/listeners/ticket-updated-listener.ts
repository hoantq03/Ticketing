import {
  Listener,
  NotFoundError,
  Subjects,
  TicketUpdatedEvent,
} from "@eztik/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const { id, title, price, version } = data;

    const ticket = await Ticket.findByEvent({ id, version });

    if (!ticket) {
      throw new NotFoundError();
    }

    ticket.price = price;
    ticket.title = title;

    await ticket.save();

    msg.ack();
  }
}
