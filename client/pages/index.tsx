import { InferGetStaticPropsType } from 'next';

import { Fade } from 'react-slideshow-image';

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

const slidesProps = {
  duration: 5000,
  transitionDuration: 1500,
  infinite: true,
  easing: 'ease',
  prevArrow: <span></span>,
  nextArrow: <span></span>,
};

export default function Home({ homePage }: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element {
  return (
    <Layout>
      <div>
        <div className='w-3/4 lg:w-1/2 xl:mt-16 mx-auto flex flex-col items-center'>
          
          <svg viewBox="0 0 88 88" width="88" height="88" className='mb-16'>
            <circle style={{fill: 'rgb(252, 225, 129)'}} cx="44" cy="44" r="44"></circle>
          </svg>
          <DocumentRenderer document={homePage.intro.document} renderers={renderers} />
          <Button link='/media-archive' label='Listen to our stories' className='relative z-10' />

        </div>
        <Fade {...slidesProps} className='-translate-y-40'>
          {homePage.slides.map((slide, i) => (
            <div key={`slide-${i}`} className='text-center'>

              <p className='text-xl lg:text-2xl text-purple translate-y-40'>&ldquo;{slide.quote}&rdquo;</p>
              <Image id={'img-' + slide.image.publicId} alt={slide.image.altText} imgId={slide.image.publicId}  />
            
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