import { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.scss';
import Header from '../components/Header';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <Head>
        <title>Space Traveling</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
