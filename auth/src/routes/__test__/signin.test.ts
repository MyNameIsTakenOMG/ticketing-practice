import request from 'supertest'
import {app} from '../../app'
import '@types/jest';

it('fails when email does not exist in DB', async() => {
  await request(app)
        .post('/api/users/signin')
        .send({
          email: 'test@example.com',
          password: 'password'
        })
        .expect(400)
}) 

it('fails when an incorrect password is supplied', async() => {
  await request(app)
        .post('/api/users/signup')
        .send({
          email: 'test@example.com',
          password: 'password'
        })
        .expect(201)
  
  await request(app)
        .post('/api/users/signin')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        expect(400)
}) 

it('response with a cookie when correct email and password supplied', async() => {
  await request(app)
        .post('/api/users/signup')
        .send({
          email: 'test@example.com',
          password: 'password'
        })
        .expect(201)
  
  const response = await request(app)
        .post('/api/users/signin')
        .send({
          email: 'test@example.com',
          password: 'password'
        })
        expect(201)
    
  expect(response.get('Set-Cookie')).toBeDefined()
}) 