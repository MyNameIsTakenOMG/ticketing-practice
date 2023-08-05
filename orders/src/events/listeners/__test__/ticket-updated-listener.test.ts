import { TicketUpdatedEvent } from '@sftickets0110/common';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketUpdatedListener } from '../ticket-updated-listener';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    title: 'Ticket',
  });
  await ticket.save();

  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    price: 20,
    title: 'Ticket Updated',
    userId: new mongoose.Types.ObjectId().toString(),
    version: ticket.version + 1,
  };
  return { msg, data, ticket, listener };
};

it('should update and save the ticket', async () => {
  const { data, listener, msg, ticket } = await setup();
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.version).toEqual(data.version);
});

it('should ack the message', async () => {
  const { data, listener, msg, ticket } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
it('should not call ack and throw an error if version number is not correct', async () => {
  const { data, listener, msg, ticket } = await setup();

  data.version = 100;
  await expect(listener.onMessage(data, msg)).rejects.toThrow();
  expect(msg.ack).not.toHaveBeenCalled();
});
