import { InferGetStaticPropsType } from 'next';
import Script from 'next/script'

import { query } from '.keystone/api';
import { DocumentRenderer, DocumentRendererProps } from '@keystone-6/document-renderer';
import { InferRenderersForComponentBlocks } from '@keystone-6/fields-document/component-blocks';
import Image from '../components/Image';
import { componentBlocks } from '../admin/components/component-blocks';


type HomePage = {
  id: string;
  intro: any;
  videos: any[];
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

export default function Home({ homePage }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div>
      <DocumentRenderer document={homePage.intro.document} renderers={renderers} />

      {/* {studio.videos.map((video, v) => (
        <div key={v} className='video'>
          <p>{video.label}</p>
          
        </div>
      ))} */}
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