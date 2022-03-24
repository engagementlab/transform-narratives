import { InferGetStaticPropsType } from 'next';
import { query } from '.keystone/api';
import { DocumentRenderer, DocumentRendererProps } from '@keystone-6/document-renderer';
import BlockRenderers from '../../components/BlockRenderers';

type CommunityPage = {
    values: any;
}; 

type Person = {
    name: string;
    image: any;
    content: any;
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
      return <p className={`${level === 3 ? 'text-2xl font-extrabold' : 'text-xl font-semibold'} text-bluegreen`} style={{ textAlign }}>{children}</p>;
    },
  },
};

export default function Community({ page, people }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div>
        <div className='px-4 xl:px-8 w-full lg:w-7/12'>
            <h2 className="text-2xl text-bluegreen font-semibold">About Our Community</h2>
            <DocumentRenderer document={page.values.document} renderers={renderers} componentBlocks={BlockRenderers} />
        </div>
        <hr className='border-[#F4B477]' />
        <div className='px-4 xl:px-8 mt-7 w-full lg:w-7/12'>
            <h2 className="text-xl text-bluegreen">Our Community</h2>
        </div>
    </div>
    

  );
}

export async function getStaticProps() {
  const page = await query.Community.findOne({
    where: { name: 'Community Page' },
    query: `values { document } `
  }) as CommunityPage;
  const people = await query.Person.findMany({
    query: `name image { publicId } content { document } `
  }) as CommunityPage;

  return {
    props: {
      page,
      people
    }
  };
}