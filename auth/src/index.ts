import 'express-async-errors';
import mongoose from 'mongoose';
import { app } from './app';
//
const start = async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT secret is required');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO URI is required');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.log(error);
  }
  app.listen(3000, () => {
    console.log('listening on port 3000!!!!');
  });
};

start();
