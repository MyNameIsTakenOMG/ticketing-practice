import React from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/useRequest';

export default function TicketShow({ ticket }) {
  const { doRequest, errors } = useRequest({
    method: 'post',
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) => {
      console.log(order);
      Router.push(`/orders/${order.id}`);
    },
    url: 'http://34.31.61.77/api/orders',
  });

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h3>Price: {ticket.price}</h3>
      <button
        onClick={() => {
          doRequest();
        }}
        className="btn btn-primary"
      >
        purchase
      </button>
      {errors}
    </div>
  );
}

export async function getServerSideProps(context, client) {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);
  return {
    props: {
      ticket: data,
    },
  };
}
