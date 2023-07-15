import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

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

abstract class listener {
  abstract subject: string;
  abstract queueGroupName: string;
  abstract onMessage(data: any, msg: Message): void;
  protected ackWait = 5000;
  private client: Stan;
  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on('message', (msg: Message) => {
      console.log(
        `received message: ${msg.getSubject().toString()}, ${
          this.queueGroupName
        }`
      );

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf-8'));
  }
}

class TicketCreatedListener extends listener {
  subject: string = 'ticket:created';
  queueGroupName: string = 'payments-service';
  onMessage(data: any, msg: Message) {
    console.log('event data: ', data);
    msg.ack();
  }
}
