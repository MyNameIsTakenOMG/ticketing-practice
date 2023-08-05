import {
  ExpirationCompletedEvent,
  Publisher,
  Subjects,
} from '@sftickets0110/common';

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompletedEvent> {
  readonly subject = Subjects.ExpirationCompleted;
}
