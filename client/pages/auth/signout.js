import React, { useEffect } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/useRequest';

export default function signout() {
  const { errors, doRequest } = useRequest({
    url: 'http://34.31.61.77/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => {
      Router.push('/');
    },
  });

  useEffect(() => {
    doRequest();

    return () => {};
  }, []);

  return <div>signing you out...</div>;
}
