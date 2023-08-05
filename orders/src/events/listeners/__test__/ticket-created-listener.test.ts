import { TicketCreatedEvent } from '@sftickets0110/common';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedListener } from '../ticket-created-listener';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  const listener = new TicketCreatedListener(natsWrapper.client);

  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toString(),
    title: 'title',
    price: 20,
    userId: new mongoose.Types.ObjectId().toString(),
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { msg, data, listener };
};

it('should create and save a ticket', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  const ticket = await Ticket.findById(data.id);
  expect(ticket!.title).toEqual(data.title);
});
it('should ack the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
