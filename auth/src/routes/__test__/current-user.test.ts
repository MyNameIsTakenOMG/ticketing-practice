import request from 'supertest';
import { app } from '../../app';

it('resonses with details of current user', async () => {
  // const authResponse = await request(app)
  //       .post('/api/users/signup')
  //       .send({
  //         email: 'user@example.com',
  //         password: 'password'
  //       })
  //       expect(201)
  // const cookie = authResponse.get('Set-Cookie')
  const cookie = await signin();

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  console.log('response.body: ', response.body);

  expect(response.body.currentUser.email).toEqual('test@example.com');
});

it('returns with null if not authenticated', async () => {
  const response = await request(app).get('/api/users/currentuser').expect(200);

  expect(response.body.currentUser).toEqual(null);
});
