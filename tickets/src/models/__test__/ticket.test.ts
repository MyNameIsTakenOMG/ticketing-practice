import { Ticket } from '../ticket';

it('should implment optimistic concurrency control', async () => {
  // create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 100,
    userId: '123',
  });
  // save it to the DB
  await ticket.save();
  // fetch the ticket twice
  const firstAttempt = await Ticket.findById(ticket.id);
  const secondAttempt = await Ticket.findById(ticket.id);
  // make changes to the ticket
  firstAttempt!.set({ price: 10 });
  secondAttempt!.set({ price: 50 });
  // save it to the database again
  await firstAttempt!.save();
  // save it to the database again
  await expect(secondAttempt!.save()).rejects.toThrow();
  // expect an error for the second attempt to modify the ticket
});

it('should increment the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'Ticket',
    price: 50,
    userId: 'user',
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
});
