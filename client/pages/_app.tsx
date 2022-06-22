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
          {/* Block indexing on non-prod */}
          {process.env.NODE_ENV !== 'production' && <meta name="robots" content="noindex" />}
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <meta name="description" content="Transforming Narratives of Gun Violence is a multi-year initiative at Emerson in collaboration with the MGH Center for Gun Violence Prevention and the Louis D. Brown Peace Institute." />
          <Favicon />
        </Head>
      </div>
      <main className='w-full mb-24 font-sans'>
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
