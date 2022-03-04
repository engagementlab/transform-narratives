
import { InferGetStaticPropsType } from 'next';
import Link from 'next/link';

// Import the generated Lists API and types from Keystone
import { query } from '.keystone/api';
import { Lists } from '.keystone/types';
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
    console.log(props.image)
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

// Home receives a `posts` prop from `getStaticProps` below
export default function Home({ posts }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div>
      <main style={{ margin: '20rem' }}>
       
          {posts.map((post, i) => (
              <div key={i}>
                <h1 className="text-3xl">{post.title}</h1>
                <DocumentRenderer key={i} document={post.content.document} 
                componentBlocks={componentBlocks} />
              </div>
          ))}
       </main>
    </div>
  );
}

export async function getStaticProps() {
  const posts = await query.Studio.findMany({ query: 'id title content { document(hydrateRelationships: true) }' }) as Studio[];
  return {
    props: {
      posts
    }
  };
}