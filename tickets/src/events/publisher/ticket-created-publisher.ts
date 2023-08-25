import { Publisher, Subjects, TicketCreatedEvent } from "@eztik/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
