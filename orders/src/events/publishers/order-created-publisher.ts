import { OrderCanceledEvent, Publisher, Subjects } from "@eztik/common";

export class OrderCanceledPublisher extends Publisher<OrderCanceledEvent> {
  readonly subject = Subjects.OrderCanceled;
}
