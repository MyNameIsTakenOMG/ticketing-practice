import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { ExpirationCompletedListener } from '../expiration-completed-listener';
import { Order, OrderStatus } from '../../../models/order';
import { ExpirationCompletedEvent } from '@sftickets0110/common';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  const listener = new ExpirationCompletedListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: 'Expiration',
    price: 10,
    id: new mongoose.Types.ObjectId().toString(),
  });
  await ticket.save();

  const order = Order.build({
    userId: 'userid',
    status: OrderStatus.Created,
    expiresAt: new Date(Date.now()),
    ticket: ticket,
  });
  await order.save();

  const data: ExpirationCompletedEvent['data'] = {
    orderId: order.id,
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { msg, data, listener, ticket, order };
};

it('should update order status to cancelled', async () => {
  const { listener, ticket, order, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(data.orderId);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('should emit an order cancelled event', async () => {
  const { listener, ticket, order, data, msg } = await setup();
  await listener.onMessage(data, msg);
  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(eventData.id).toEqual(order.id);
});

it('should call ack', async () => {
  const { listener, ticket, order, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
