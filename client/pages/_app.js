import 'bootstrap/dist/css/bootstrap.css';
import App from 'next/app';
import buildClient from '../api/build-client';
import Header from '../api/components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      {/* <h1>Header !</h1> */}
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />;
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');
  const appProps = await App.getInitialProps(
    appContext,
    client,
    data.currentUser
  );
  console.log(Object.keys(appContext).toString());
  console.log(data);
  return { ...data, ...appProps };
};

export default AppComponent;
