import 'express-async-errors';
import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';

const start = async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT secret is required');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is required');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID is required');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL is required');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID is required');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
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

    //initialize listeners
    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.log(error);
  }
  app.listen(3000, () => {
    console.log('listening on port 3000!!!!');
  });
};

start();
