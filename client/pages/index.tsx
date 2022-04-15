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
        <div className='w-3/4 lg:w-1/2 xl:mt-16 mx-auto'>

          <div className=''>
            <div className='flex flex-col items-center'>
              <svg viewBox="0 0 88 88" width="88" height="88" className='mb-16'>
                <circle style={{fill: 'rgb(252, 225, 129)'}} cx="44" cy="44" r="44"></circle>
              </svg>

              <DocumentRenderer document={homePage.intro.document} renderers={renderers} />
            </div>
          </div>
          
        </div>
        <div className='w-full'>
          <div className='w-full flex flex-col items-center -translate-y-10 xl:translate-y-0 absolute z-10'>
            <Button link='/archive' label='Listen to our stories' />
          </div>
        <Fade {...slidesProps}>
          {homePage.slides.map((slide, i) => (
            <div key={`slide-${i}`} className='text-center'>
            
              <p className='text-xl lg:text-2xl text-purple translate-y-40'>&ldquo;{slide.quote}&rdquo;</p>
              <Image id={'img-' + slide.image.publicId} alt={slide.altText} imgId={slide.image.publicId} width={1900} className='w-full aspect-[3/2]' lazy={true} />

            </div>
          ))}
        </Fade>
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