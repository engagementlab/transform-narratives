import '../styles/globals.css'
import type { AppProps } from 'next/app';
import Head from 'next/head'
import Header from '../components/Header'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>

      <div>
        <Head>
          <title>Transforming Narratives of Gun Violence</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
      </div>
      <main className='w-full xl:px-8 my-7 mb-24 '>
      <Header />
      <Component {...pageProps} />
      </main>
    </div>
  ) 
}

export default MyApp
