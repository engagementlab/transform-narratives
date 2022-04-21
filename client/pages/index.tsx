import { InferGetStaticPropsType } from 'next';

import { Fade, SlideshowProps } from 'react-slideshow-image';

import { query } from '.keystone/api';
import { DocumentRenderer, DocumentRendererProps } from '@keystone-6/document-renderer';
import Image from '../components/Image';
import Button from '../components/Button';
import Layout from '../components/Layout';
import HeadingStyle from '../components/HeadingStyle';

type HomePage = {
  id: string;
  intro: any;
  slides: any[];
}; 

const renderers: DocumentRendererProps['renderers'] = {
  // use your editor's autocomplete to see what other renderers you can override
  inline: {
    bold: ({ children }) => {
      return <strong>{children}</strong>;
    },
  },
  block: {
    heading: ({ level, children, textAlign }) => {
      const customRenderers = {
        2: 'text-2xl text-coated font-semibold'
      };
      return HeadingStyle(level, children, textAlign, customRenderers);
    },
  },
};

const slidesProps: SlideshowProps = {
  duration: 4000,
  transitionDuration: 1000,
  infinite: true,
  easing: 'ease',
  arrows: false,
  pauseOnHover: false,
};

export default function Home({ homePage }: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element {
  return (
    <Layout>
        <div className='relative w-full mt-20 lg:max-h-screen overflow-clip'>
          <div className='flex flex-col items-center'>
            <div className='w-2/3 max-w-md text-center absolute z-10'>
              <h2 className='quote-shadow text-lg sm:text-xl font-semibold'>Nearly every person in the U.S. will know someone who has been shot in their lifetime.</h2>
              <h1 className='quote-shadow text-xl sm:text-2xl font-bold text-purple mt-6'>Everyone has a story to tell.</h1>
              <Button className='' link='/archive' label='Listen to our stories' />
            </div>
          </div>

          <Fade {...slidesProps} className='max-h-screen sm:min-h-full lg:-mt-20 z-0'>
            {homePage.slides.map((slide, i) => (
              <div key={`slide-${i}`}>
                <div className='w-2/3 max-w-lg text-center mx-auto'>
                  <p className='quote-shadow text-xl sm:text-2xl font-bold text-coated translate-y-96'>&ldquo;{slide.quote}&rdquo;</p>
                </div>
                <Image id={'img-' + slide.image.publicId} alt={slide.altText} imgId={slide.image.publicId} width={1900} className='sm:w-full aspect-[3/2]' lazy={true} />
              </div>
            ))}
          </Fade>

          <p className='absolute bottom-0 w-full text-sm px-4 m-0 text-bluegreen text-center quote-shadow font-semibold -translate-y-10 z-20 sm:-translate-y-12 lg:text-lg'>Through local and collaborative storytelling, we seek to inspire solutions and interrupt cycles of gun violence.</p>
        </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const homePage = await query.Home.findOne({
    where: { name: 'Home Page' },
    query: `
    id 
    intro { document } 
    slides {
      image
      {
        publicId
      }
      altText
      quote
    }`
  }) as HomePage;

  return {
    props: {
      homePage
    }
  };
}