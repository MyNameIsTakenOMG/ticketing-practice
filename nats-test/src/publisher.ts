import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  console.log('publisher connected to nats server');

  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: '123',
      title: 'connect',
      price: 20,
    });
  } catch (error) {
    console.log(error);
  }
  // nats only accepts strings or raw data
  // let data = JSON.stringify({
  //   id: '123',
  //   title: 'connect',
  //   price: 20,
  // });

  // stan.publish('ticket:created', data, () => {
  //   console.log('event published');
  // });
});
