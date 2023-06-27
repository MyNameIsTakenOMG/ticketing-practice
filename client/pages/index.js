import React from 'react';
import axios from 'axios';
import buildClient from '../api/build-client';

export default function LandingPage({ currentUser }) {
  // console.log('I am in the component ' + color);
  console.log(currentUser);
  return currentUser ? (
    <h1>you are signed in</h1>
  ) : (
    <h1>you are not signed in</h1>
  );
}

export async function getServerSideProps(context) {
  const { data } = await buildClient(context).get('/api/users/currentuser');

  return {
    props: data,
  };

  // console.log('req headers: ', context.req.headers);
  // console.log('I am on the server side');

  // // directly communicate with another service is not recommended
  // // const response = await axios.get('api/users/currentuser', {
  // //   baseURL: 'http://auth-srv',
  // // });

  // // choose another option: send request to the ingress with cookie,
  // // let ingress to forward request to the destination service
  // if (typeof window === 'undefined') {
  //   // we are on the server side
  //   // request url should be FQDN
  //   const response = await axios.get(
  //     'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
  //     {
  //       headers: context.req.headers,
  //     }
  //   );
  //   return {
  //     props: response.data,
  //   };
  // } else {
  //   // we are on the client side
  //   // request url should be the cluster domain name (or load balancer/ingress ip address)
  //   const response = await axios.get(
  //     'http://34.31.61.77/api/users/currentuser'
  //   );
  //   return {
  //     props: response.data,
  //   };
  // }

  // // return response.data;
  // // return { color: 'red' };
}
