import request from 'supertest';
import { app } from '../../app';

const createTicket = () => {
  return request(app).post('/api/tickets').set('Cookie', signin()).send({
    title: 'wefa',
    price: 20,
  });
};

it('should return a list of tickets', async () => {
  await createTicket();
  await createTicket();
  await createTicket();
  const response = await request(app).get('/api/tickets').send({}).expect(200);

  expect(response.body.length).toEqual(3);
});
