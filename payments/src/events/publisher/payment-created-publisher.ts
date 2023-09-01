import { PaymentCreatedEvent, Publisher, Subjects } from "@eztik/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
