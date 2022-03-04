import { InferGetStaticPropsType } from 'next';
import Script from 'next/script'

// Import the generated Lists API and types from Keystone
import { query } from '.keystone/api';
import { DocumentRenderer } from '@keystone-6/document-renderer';
import Image from '../components/Image';


type Studio = {
  id: string;
  content: any;
  title: string;
  videos: any[];
};

const componentBlocks = {
  image: (props: any) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* <img
              className="body-image"
              src={props.image.data.image.publicUrlTransformed}
              alt=
            /> */}
                <Image id={'img' + props.image.data.image.publicId} alt={props.image.data.altText} imgId={props.image.data.image.publicId}  />


      </div>
    );
  },
};

// Home receives a `studios` prop from `getStaticProps` below
export default function Home({ studios }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div>
      <main style={{ margin: '20rem' }}>
       
          {studios.map((studio, i) => (
              <div key={i}>
                <h1 className="text-3xl">{studio.title}</h1>
                <DocumentRenderer key={i} document={studio.content.document} 
                componentBlocks={componentBlocks} />

                {studio.videos.map((video, v) => (
                  <div key={v} className='video'>
                    <p>{video.label}</p>
                    <div id={"video-embed-"+v}>
                        <iframe
                            src={video.value}
                            frameBorder="0"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                      <Script src="https://player.vimeo.com/api/player.js"></Script>
                    </div>
                  </div>
                ))}
              </div>
          ))}
       </main>
    </div>
  );
}

export async function getStaticProps() {
  const studios = await query.Studio.findMany({ query: 'id title content { document(hydrateRelationships: true) } videos' }) as Studio[];
  console.log(studios[0].videos)
  return {
    props: {
      studios
    }
  };
}