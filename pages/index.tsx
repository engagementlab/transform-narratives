import { InferGetStaticPropsType } from 'next';

import { Fade } from 'react-slideshow-image';

import { query } from '.keystone/api';
import { DocumentRenderer, DocumentRendererProps } from '@keystone-6/document-renderer';
import Image from '../components/Image';
import Button from '../components/Button';

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
      return <p className='text-2xl text-coated font-semibold' style={{ textAlign }}>{children}</p>;
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

export default function Home({ homePage }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div className=''>
      <div className='w-3/4 lg:w-1/2 text-center mx-auto'>
        <DocumentRenderer document={homePage.intro.document} renderers={renderers} />
        <Button link='/media-archive' label='Listen to our stories' className='relative z-50' />
      </div>
      <Fade {...slidesProps} className='-translate-y-40'>
        {homePage.slides.map((slide, i) => (
          <div key={`slide-${i}`} className=' text-center'>
            <p className='text-xl lg:text-2xl text-purple translate-y-40'>&ldquo;{slide.quote}&rdquo;</p>
            <Image id={'img-' + slide.image.publicId} alt={slide.image.altText} imgId={slide.image.publicId}  />
          
          </div>
        ))}
      </Fade>
    </div>
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