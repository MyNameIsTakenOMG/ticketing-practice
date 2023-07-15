import { Message } from 'node-nats-streaming';
import { listener } from './base-listener';

class TicketCreatedListener extends listener {
  subject: string = 'ticket:created';
  queueGroupName: string = 'payments-service';
  onMessage(data: any, msg: Message) {
    console.log('event data: ', data);
    msg.ack();
  }
}

export { TicketCreatedListener };
