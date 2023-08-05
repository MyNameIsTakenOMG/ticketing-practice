import { OrderCreatedEvent, Publisher, Subjects } from '@sftickets0110/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
