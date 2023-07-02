import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

// import { erorrHandler } from './middleware/error-handler';
// import { NotFoundError } from './errors/not-found-error';
import {
  currentUserMiddleware,
  erorrHandler,
  NotFoundError,
} from '@sftickets0110/common';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes';
import { updateTicketRouter } from './routes/update';

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

app.use(currentUserMiddleware);

// routes
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

//404 error
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

// error handler
app.use(erorrHandler);

export { app };
