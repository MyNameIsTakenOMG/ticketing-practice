import { Message } from 'node-nats-streaming';
import { listener } from './base-listener';
import { TicketCreatedEvent } from './ticket-created-event';
import { Subjects } from './subjects';

class TicketCreatedListener extends listener<TicketCreatedEvent> {
  // subject: Subjects.TicketCreated = Subjects.TicketCreated;
  readonly subject = Subjects.TicketCreated;
  queueGroupName: string = 'payments-service';
  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('event data: ', data);
    msg.ack();
  }
}

export { TicketCreatedListener };
