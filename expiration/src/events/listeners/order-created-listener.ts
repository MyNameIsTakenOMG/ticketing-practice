import { listener, OrderCreatedEvent } from '@sftickets0110/common';
import { Subjects } from '@sftickets0110/common/build/events/subjects';
import { OrderStatus } from '@sftickets0110/common/build/events/types/order-status';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { expirationQueue } from '../../queues/expiration-queue';

export class OrderCreatedListener extends listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(
    data: OrderCreatedEvent['data'],
    msg: Message
  ): Promise<void> {
    // throw new Error("Method not implemented.");
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay: delay,
      }
    );

    msg.ack();
  }
}
