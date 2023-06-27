import React from 'react';
import axios from 'axios';

export default function LandingPage({ currentUser }) {
  // console.log('I am in the component ' + color);
  console.log(currentUser);
  return <div>landing page</div>;
}

export async function getServerSideProps({ req, res }) {
  console.log('req headers: ', req.headers);
  console.log('I am on the server side');

  // directly communicate with another service is not recommended
  // const response = await axios.get('api/users/currentuser', {
  //   baseURL: 'http://auth-srv',
  // });

  // choose another option: send request to the ingress with cookie,
  // let ingress to forward request to the destination service
  if (typeof window === 'undefined') {
    // we are on the server side
    // request url should be FQDN
    const response = await axios.get(
      'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
      {
        headers: req.headers,
      }
    );
    return {
      props: response.data,
    };
  } else {
    // we are on the client side
    // request url should be the cluster domain name (or load balancer/ingress ip address)
    const response = await axios.get(
      'http://34.31.61.77/api/users/currentuser'
    );
    return {
      props: response.data,
    };
  }

  // return response.data;
  // return { color: 'red' };
}
