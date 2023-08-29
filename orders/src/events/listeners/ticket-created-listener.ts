import { Message } from "node-nats-streaming";
import { Subjects, TicketCreatedEvent, Listener } from "@eztik/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";
export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, title, price, version } = data;
    const ticket = Ticket.build({
      id,
      title,
      price,
      version,
    });
    await ticket.save();

    msg.ack();
  }
}
