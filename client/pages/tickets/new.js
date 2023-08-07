import React, { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/useRequest';

export default function NewTicket() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const { doRequest, errors } = useRequest({
    method: 'post',
    body: {
      title,
      price,
    },
    onSuccess: (ticket) => {
      console.log(ticket);
      Router.push('/');
    },
    url: 'http://34.31.61.77/api/tickets',
  });

  const onSubmit = (e) => {
    e.preventDefault();
    doRequest();
  };

  const onBlur = () => {
    const value = parseFloat(price);
    if (isNaN(value)) {
      return;
    }
    setPrice(value.toFixed(2));
  };

  return (
    <div>
      <h1>New Ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>title</label>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>price</label>
          <input
            value={price}
            onBlur={onBlur}
            onChange={(e) => {
              setPrice(e.target.value);
            }}
            className="form-control"
          />
        </div>
        {errors}
        <button className="btn btn-primary">submit</button>
      </form>
    </div>
  );
}
