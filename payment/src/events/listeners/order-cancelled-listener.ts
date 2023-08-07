import {
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
  listener,
} from '@sftickets0110/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class OrderCancelledListener extends listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;
  async onMessage(
    data: OrderCancelledEvent['data'],
    msg: Message
  ): Promise<void> {
    // throw new Error("Method not implemented.");
    const theOrder = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });
    if (!theOrder) {
      throw new Error('order not found');
    }
    theOrder.set({
      status: OrderStatus.Cancelled,
    });
    await theOrder.save();
    msg.ack();
  }
}
