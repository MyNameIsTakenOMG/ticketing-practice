import express from 'express';
import 'express-async-errors';
import mongoose, { mongo } from 'mongoose';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { erorrHandler } from './middleware/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

// app.get('/api/users/currentuser', (req, res) => {
//   res.send('hello world!');
// });

// routes
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

//404 error
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

// error handler
app.use(erorrHandler);

const start = async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT secret is required');
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
  } catch (error) {
    console.log(error);
  }
  app.listen(3000, () => {
    console.log('listening on port 3000!!!!');
  });
};

start();
