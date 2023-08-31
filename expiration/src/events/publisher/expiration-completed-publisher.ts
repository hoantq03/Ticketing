import { ExpirationCompletedEvent, Publisher, Subjects } from "@eztik/common";

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompletedEvent> {
  readonly subject = Subjects.ExpirationCompleted;
}
