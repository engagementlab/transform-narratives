import '../styles/globals.css'
import type { AppProps } from 'next/app';
import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer';
import Favicon from '../components/Favicon';
import { AnimatePresence } from 'framer-motion';

function App({ Component, pageProps }: AppProps) {
  return (
    <div>

      <div>
        <Head>
          <title>Transforming Narratives of Gun Violence</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <Favicon />
        </Head>
      </div>
      <main className='w-full mb-24 font-sans antialiased'>
      <Header />
      <AnimatePresence 
                exitBeforeEnter
                initial={false}
                onExitComplete={() => window.scrollTo(0, 0)}>

        <Component {...pageProps} />
      </AnimatePresence>
      <Footer />
      </main>
    </div>
  ) 
}

export default App
