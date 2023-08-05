import {
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
  listener,
} from '@sftickets0110/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(
    data: OrderCreatedEvent['data'],
    msg: Message
  ): Promise<void> {
    // throw new Error("Method not implemented.");
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new Error('ticket not found');
    }
    ticket.set({ orderId: data.id });
    await ticket.save();
    // to make sure the version of the ticket is synced
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
      orderId: ticket.orderId,
    });

    msg.ack();
  }
}
