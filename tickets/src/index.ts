import 'express-async-errors';
import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT secret is required');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is required');
  }

  try {
    await natsWrapper.connect('ticketing', 'awfwawef', 'http://nats-srv:4222');
    natsWrapper.client.on('close', () => {
      console.log('nats connection closed');
      process.exit();
    });
    process.on('SIGINT', () => {
      natsWrapper.client.close();
    });
    process.on('SIGTERM', () => {
      natsWrapper.client.close();
    });

    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.log(error);
  }
  app.listen(3000, () => {
    console.log('listening on port 3000!!!!');
  });
};

start();
