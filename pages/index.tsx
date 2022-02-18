
import { InferGetStaticPropsType } from 'next';
import Link from 'next/link';

// Import the generated Lists API and types from Keystone
import { query } from '.keystone/api';
import { Lists } from '.keystone/types';
import { DocumentRenderer } from '@keystone-6/document-renderer';


type Studio = {
  id: string;
  content: any;
  slug: string;
};

// Home receives a `posts` prop from `getStaticProps` below
export default function Home({ posts }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div>
      <main style={{ margin: '20rem' }}>
       
          {posts.map((post, i) => (

<div>

            <h1 className="text-3xl">{post.title}</h1>
            <DocumentRenderer key={i} document={post.content.document} />
</div>
          ))}
       </main>
    </div>
  );
}

// Here we use the Lists API to load all the posts we want to display
// The return of this function is provided to the `Home` component
export async function getStaticProps() {
  const posts = await query.Studio.findMany({ query: 'id title content { document }' }) as Studio[];
  return {
    props: {
      posts
    }
  };
}