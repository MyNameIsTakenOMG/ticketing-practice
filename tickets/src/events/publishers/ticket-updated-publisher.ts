import { Publisher, Subjects, TicketUpdatedEvent } from '@sftickets0110/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
