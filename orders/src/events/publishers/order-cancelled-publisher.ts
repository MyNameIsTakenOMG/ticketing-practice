import {
  OrderCancelledEvent,
  Publisher,
  Subjects,
} from '@sftickets0110/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
