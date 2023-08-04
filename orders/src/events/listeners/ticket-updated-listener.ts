import { Subjects, TicketUpdatedEvent, listener } from '@sftickets0110/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';

export class TicketUpdatedListener extends listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;
  async onMessage(
    data: TicketUpdatedEvent['data'],
    msg: Message
  ): Promise<void> {
    // throw new Error("Method not implemented.");
    const { id, title, price, userId } = data;
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      throw new Error('ticket not found');
    }
    ticket.set({
      title: title,
      price: price,
    });
    await ticket.save();
    msg.ack();
  }
}
