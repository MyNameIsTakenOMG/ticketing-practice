import React from 'react';

export default function OrderIndex({ orders }) {
  return (
    <ul>
      {orders.map((order) => {
        return (
          <li key={order.id}>
            {order.ticket.title} - {order.status}
          </li>
        );
      })}
    </ul>
  );
}

export async function getServerSideProps(context, client) {
  const { data } = await client.get('/api/orders');
  return {
    props: {
      orders: data,
    },
  };
}
