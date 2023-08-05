import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import request from 'supertest';

it('should return the order', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toString(),
    title: 'title',
    price: 10,
  });
  await ticket.save();

  const user = signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);
});
it('should return an error if trying fetching not owned order', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toString(),
    title: 'title',
    price: 10,
  });
  await ticket.save();

  const user1 = signin();
  const user2 = signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user2)
    .send()
    .expect(401);
});
