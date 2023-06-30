import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

// import { erorrHandler } from './middleware/error-handler';
// import { NotFoundError } from './errors/not-found-error';
import { erorrHandler, NotFoundError } from '@sftickets0110/common';
import { createTicketRouter } from './routes/new';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cookieSession({
    signed: false,
    // secure: process.env.NODE_ENV !=='test',
    secure: process.env.NODE_ENV === 'production',
  })
);

// app.get('/api/users/currentuser', (req, res) => {
//   res.send('hello world!');
// });

// routes
app.use(createTicketRouter);

//404 error
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

// error handler
app.use(erorrHandler);

export { app };
