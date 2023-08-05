import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import request from 'supertest';

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toString(),
    title: 'Ticket',
    price: 20,
  });
  await ticket.save();
  return ticket;
};

it('should return a list of orders for the signed in user', async () => {
  const ticket1 = await buildTicket();
  const ticket2 = await buildTicket();
  const ticket3 = await buildTicket();

  const user1 = signin();
  const user2 = signin();

  await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket1.id })
    .expect(201);

  await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket2.id })
    .expect(201);
  await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket3.id })
    .expect(201);

  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', user2)
    .expect(200);

  // console.log('response._body: ', response.body);

  expect(response.body.length).toEqual(2);
});
