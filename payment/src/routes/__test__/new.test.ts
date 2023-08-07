import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { OrderStatus } from '@sftickets0110/common';

it('should return 404 when buying an order not existing', async () => {
  await request(app)
    .post('/api/payment')
    .set('Cookie', signin())
    .send({
      token: 'awfewaef',
      orderId: new mongoose.Types.ObjectId().toString(),
    })
    .expect(404);
});

it('should return 401 when buying an order that doesnt belogn to the user', async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toString(),
    price: 10,
    userId: 'userId',
    version: 0,
    status: OrderStatus.Created,
  });
  await order.save();
  await request(app)
    .post('/api/payment')
    .set('Cookie', signin())
    .send({
      token: 'awfewaef',
      orderId: order.id,
    })
    .expect(401);
});

it('should return 400 when buying an order that is cancelled', async () => {
  const userId = new mongoose.Types.ObjectId().toString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toString(),
    price: 10,
    userId: userId,
    version: 0,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await request(app)
    .post('/api/payment')
    .set('Cookie', signin(userId))
    .send({
      orderId: order.id,
      token: 'aefwaf',
    })
    .expect(400);
});
