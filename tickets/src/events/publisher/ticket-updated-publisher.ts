import { Publisher, Subjects, TicketUpdatedEvent } from "@eztik/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
