import { OrderCreatedEvent, Publisher, Subjects } from "@eztik/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
