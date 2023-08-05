import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import request from 'supertest';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';

it('should successfully delete(cancel) the order', async () => {
  // create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toString(),
    title: 'title',
    price: 20,
  });
  await ticket.save();

  const user = signin();
  // create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
  // request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);
  // expectation
});

// it.todo('emits an order cancelled event');

it('should publish an order cancelled event', async () => {
  // create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toString(),
    title: 'title',
    price: 20,
  });
  await ticket.save();

  const user = signin();
  // create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
  // request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);
  // expectation
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
