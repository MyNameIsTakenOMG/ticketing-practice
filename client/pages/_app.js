import 'bootstrap/dist/css/bootstrap.css';
import App from 'next/app';
import buildClient from '../api/build-client';

const AppComponent = ({ Component, pageProps }) => {
  return (
    <div>
      <h1>Header !</h1>
      <Component {...pageProps} />;
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);
  console.log(Object.keys(appContext).toString());
  const { data } = await buildClient(appContext.ctx).get(
    '/api/users/currentuser'
  );
  console.log(data);
  return { data, ...appProps };
};

export default AppComponent;
