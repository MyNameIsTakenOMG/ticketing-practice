import React, { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/useRequest';

export default function OrderShow({ order, currentUser }) {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => {
      console.log(payment);
      Router.push(`/orders/${order.id}`);
    },
    url: 'http://34.31.61.77/api/payment',
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft();
    const timerId = setInterval(() => {
      findTimeLeft();
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>order expired</div>;
  }

  return (
    <div>
      Time left to pay: {timeLeft} seconds
      <StripeCheckout
        token={(token) => {
          const id = token.id;
          console.log(token);
          doRequest({ token: id });
        }}
        stripeKey="pk_test_51NcXarHNP3ARsxXFITisZ58k4WOS2bED4mWRdyPAaalDqHit5j3buNllAGB56F2fgCZgKtElep6UdzDKJPrJzY7y00QKPVp6uJ"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
}

export async function getServerSideProps(context, client) {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return {
    props: {
      order: data,
    },
  };
}
