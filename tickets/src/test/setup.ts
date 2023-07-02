import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';
import jwt from 'jsonwebtoken';

declare global {
  var signin: () => string[]; // return  [`session=${base64}`]
}

let mongo: any;

beforeAll(async () => {
  process.env.JWT_SECRET = 'jwt-secret';

  mongo = await MongoMemoryServer.create();
  const mongoURI = mongo.getUri();

  await mongoose.connect(mongoURI, {});
}, 50000);

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
}, 50000);

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
}, 50000);

global.signin = () => {
  // build a jwt payload  {id ,email}
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };
  // create a jwt token
  const token = jwt.sign(payload, process.env.JWT_SECRET!);
  // build a session object { jwt: jwtToken }
  const session = { jwt: token };
  // turn the object into a JSON object
  const sessionJSON = JSON.stringify(session);
  // encode the JSON object with base64
  const base64 = Buffer.from(sessionJSON).toString('base64');
  // return a string thats the cookie with the encoded string
  return [`session=${base64}`];
};
