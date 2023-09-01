import { OrderCanceledEvent, Publisher, Subjects } from "@eztik/common";

export class OrderCancelledPublisher extends Publisher<OrderCanceledEvent> {
  readonly subject = Subjects.OrderCanceled;
}
