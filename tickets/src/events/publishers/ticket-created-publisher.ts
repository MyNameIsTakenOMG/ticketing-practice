import { Publisher, Subjects, TicketCreatedEvent } from '@sftickets0110/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
