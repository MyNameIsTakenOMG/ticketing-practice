import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';
import { OrderCreatedEvent, OrderStatus } from '@sftickets0110/common';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  // listener
  const listener = new OrderCreatedListener(natsWrapper.client);
  // ticket
  const ticket = Ticket.build({
    price: 9,
    title: 'Order created',
    userId: new mongoose.Types.ObjectId().toString(),
  });
  await ticket.save();
  // data
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toString(),
    status: OrderStatus.Created,
    userId: 'userId',
    expiresAt: 'fakedDate',
    version: 0,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };
  // message
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { msg, data, ticket, listener };
};

it('should update the orderId for the ticket', async () => {
  const { listener, data, msg, ticket } = await setup();
  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('should call the ack', async () => {
  const { listener, data, msg, ticket } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it('should publish a ticket update event', async () => {
  const { listener, data, msg, ticket } = await setup();
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const ticketUpdateData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(data.id).toEqual(ticketUpdateData.orderId);
});
