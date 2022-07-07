import '../styles/globals.css'
import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer';
// import {Favicon} from '@el-next/components';
// import { AnimatePresence } from 'framer-motion';

function App({ Component, pageProps }: AppProps) {
  console.log(typeof Favicon)
  return (
    <div>
      <div>
        <Head>
          <title>Transforming Narratives of Gun Violence</title>
          {/* Block indexing on non-prod */}
          {process.env.NODE_ENV !== 'production' && <meta name="robots" content="noindex" />}
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <meta name="description" content={process.env.NODE_ENV} />
          {/* <Favicon /> */}
        </Head>
      </div>
      <main className='w-full mb-24 font-sans'>
      <Header />
      {/* <AnimatePresence
                exitBeforeEnter
                initial={false}
                onExitComplete={() => window.scrollTo(0, 0)}> */}

        <Component {...pageProps} />
      {/* </AnimatePresence> */}
      {/* <Footer /> */}
      </main>
    </div>
  )
}

export default App
