import {
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
  listener,
} from '@sftickets0110/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class OrderCreatedListener extends listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(
    data: OrderCreatedEvent['data'],
    msg: Message
  ): Promise<void> {
    // throw new Error("Method not implemented.");
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      userId: data.userId,
      version: data.version,
      status: data.status,
    });
    await order.save();

    msg.ack();
  }
}
