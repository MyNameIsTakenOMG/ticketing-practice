import nats from 'node-nats-streaming';

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('publisher connected to nats server');

  // nats only accepts strings or raw data
  let data = JSON.stringify({
    id: '123',
    title: 'connect',
    price: 20,
  });

  stan.publish('ticket:created', data, () => {
    console.log('event published');
  });
});
