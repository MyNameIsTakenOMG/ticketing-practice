import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';

it('returns a 404 if the id is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', signin())
    .send({
      title: 'awefa',
      price: 20,
    })
    .expect(404);
});
it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'awefa',
      price: 20,
    })
    .expect(401);
});
it('returns a 401 if the user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({
      title: 'afwef',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', signin())
    .send({
      title: 'awfwf',
      price: 1000,
    })
    .expect(401);
});
it('returns a 400 if the user provides invalid title or price', async () => {
  const cookie = signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'afwef',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20,
    })
    .expect(400);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'faweawef',
      price: -20,
    })
    .expect(400);
});
it('updates the ticket with provided inputs', async () => {
  const cookie = signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'afwef',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 200,
    })
    .expect(200);

  const ticket = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();
  expect(ticket.body.title).toEqual('new title');
  expect(ticket.body.price).toEqual(200);
});

it('should publish an event', async () => {
  const cookie = signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'afwef',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 200,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
