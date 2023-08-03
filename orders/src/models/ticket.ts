import mongoose from 'mongoose';

interface TicketAttrs {
  title: string;
  price: number;
}
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
}
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
});

ticketSchema.methods.toJSON = function () {
  const { __v, _id, ...ticket } = this.toObject();
  ticket.id = _id;
  return ticket;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

ticketSchema.statics.build = function (attrs: TicketAttrs) {
  return new Ticket(attrs);
};

export { Ticket };
