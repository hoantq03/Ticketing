import { Publisher, OrderCreatedEvent, Subjects } from "@eztik/common";
import { Order } from "../../models/orders";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
