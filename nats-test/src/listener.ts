import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('listener connected to nats server');

  // queue group make sure a message is sent to only one of instances of certain service
  const subscription = stan.subscribe(
    'ticket:created',
    'orders-service-queue-group'
  );

  subscription.on('message', (msg: Message) => {
    console.log('received message');
    const data = msg.getData();

    if (typeof data === 'string') {
      console.log(
        `received message #${msg.getSequence} with data: ${JSON.parse(data)}`
      );
    }
  });
});
