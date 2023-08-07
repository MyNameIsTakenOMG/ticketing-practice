import {
  PaymentCreatedEvent,
  Publisher,
  Subjects,
} from '@sftickets0110/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
