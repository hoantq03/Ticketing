import { Message } from "node-nats-streaming";
import { Subjects, TicketCreatedEvent, Listener } from "@eztik/common";
import { Ticket } from "../../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  readonly queueGroupName = "orders-service";

  onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    console.log(data);
  }
}
