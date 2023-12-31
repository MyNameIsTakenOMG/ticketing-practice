import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('listener connected to nats server');

  stan.on('close', () => {
    console.log('nats connection closed');
    process.exit();
  });

  new TicketCreatedListener(stan).listen();

  // const options = stan
  //   .subscriptionOptions()
  //   .setManualAckMode(true)
  //   .setDeliverAllAvailable()
  //   .setDurableName('accounting-service');
  // // queue group make sure a message is sent to only one of instances of certain service
  // const subscription = stan.subscribe(
  //   'ticket:created',
  //   'orders-service-queue-group',
  //   options
  // );

  // subscription.on('message', (msg: Message) => {
  //   console.log('received message');
  //   const data = msg.getData();

  //   if (typeof data === 'string') {
  //     console.log(
  //       `received message #${msg.getSequence} with data: ${JSON.parse(data)}`
  //     );
  //   }
  //   msg.ack();
  // });
});

process.on('SIGINT', () => {
  stan.close();
});
process.on('SIGTERM', () => {
  stan.close();
});
