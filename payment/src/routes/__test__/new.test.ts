import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { OrderStatus } from '@sftickets0110/common';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';

jest.mocked('../../stripe');

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

it('should return a 204 with value inputs', async () => {
  const userId = new mongoose.Types.ObjectId().toString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toString(),
    price: 10,
    userId: userId,
    version: 0,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/payment')
    .set('Cookie', signin(userId))
    .send({
      orderId: order.id,
      token: 'tok_visa',
    })
    .expect(201);

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions.source).toEqual('tok_visa');
  expect(chargeOptions.currency).toEqual('usd');
  expect(chargeOptions.amount).toEqual(10 * 100);
});

it('should create a payment record after making a payment', async () => {
  const userId = new mongoose.Types.ObjectId().toString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toString(),
    price: 10,
    userId: userId,
    version: 0,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/payment')
    .set('Cookie', signin(userId))
    .send({
      orderId: order.id,
      token: 'tok_visa',
    })
    .expect(201);

  const payment = await Payment.findOne({
    orderId: order.id,
  });
  expect(payment).toBeDefined();
});
