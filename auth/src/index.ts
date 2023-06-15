import express from 'express';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { erorrHandler } from './middleware/error-handler';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.get('/api/users/currentuser', (req, res) => {
//   res.send('hello world!');
// });
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.use(erorrHandler);

app.listen(3000, () => {
  console.log('listening on port 3000!!!!');
});
