import 'bootstrap/dist/css/bootstrap.css';
import App from 'next/app';
import buildClient from '../api/build-client';
import Header from '../api/components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      {/* <h1>Header !</h1> */}
      <Header currentUser={currentUser} />
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
  return { ...data, ...appProps };
};

export default AppComponent;
