import express from 'express';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { erorrHandler } from './middleware/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.get('/api/users/currentuser', (req, res) => {
//   res.send('hello world!');
// });

// routes
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

//404 error
app.get('*', (req, res) => {
  throw new NotFoundError();
});

// error handler
app.use(erorrHandler);

app.listen(3000, () => {
  console.log('listening on port 3000!!!!');
});
