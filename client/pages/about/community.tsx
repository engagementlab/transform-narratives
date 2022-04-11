import { InferGetStaticPropsType } from 'next';
import { query } from '.keystone/api';
import { DocumentRenderer, DocumentRendererProps } from '@keystone-6/document-renderer';
import BlockRenderers from '../../components/BlockRenderers';
import Image from '../../components/Image';
import Layout from '../../components/Layout';
import ImagePlaceholder from '../../components/ImagePlaceholder';
import HeadingStyle from '../../components/HeadingStyle';

type CommunityPage = {
    values: any;
}; 

type Person = {
    name: string;
    title: string;
    remembrance: string;
    blurb: string;
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

      const customRenderers = {
        3: 'text-2xl font-extrabold text-bluegreen',
        4: 'text-xl font-semibold text-bluegreen',
      };
      return HeadingStyle(level, children, textAlign, customRenderers);
    },
  },
};

export default function Community({ page, people }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout>
      <div>
          <div
          className="container mt-14 mb-14 xl:mt-16 px-4 xl:px-8">
              <h2 className="text-2xl text-bluegreen font-extrabold">About Our Community</h2>
              <DocumentRenderer document={page.values.document} renderers={renderers} componentBlocks={BlockRenderers} />
          </div>
          <hr className='border-[#F4B477]' />
          <div className='px-4 xl:px-8 mt-7 w-full lg:w-7/12'>
              <h2 className="text-xl text-bluegreen font-semibold">Our Community</h2>

              {people.map((person, i) => (
                <div key={i} className='flex flex-col lg:flex-row mt-5'>
                      <div className='w-full lg:w-1/3 flex-shrink-0'>
                          {person.image ?
                            <Image id={`thumb-${i}`} alt={`Thumbnail for person with name "${person.name}"`} imgId={person.image.publicId} width={300} /> :
                            <ImagePlaceholder imageLabel='Bio' width={300} height={300} />
                          }
                      </div>
                      <div className='ml-4'>
                          <h4 className='text-xl font-semibold'>{person.name}</h4>
                          <p>{person.title}</p>
                            {person.blurb && ( 
                              <p>
                                <strong>
                                What brings you here?
                                </strong>
                                <br />
                                {person.blurb}
                              </p>
                            )}
                            {person.remembrance && (
                              <p>
                                In remembrance of {person.remembrance}
                              </p>
                            )}
                          {/* <DocumentRenderer document={person.content.document} renderers={renderers} componentBlocks={BlockRenderers} /> */}
                      </div>
                  </div>
              ))}
          </div>
      </div>
    </Layout>
    

  );
}

export async function getStaticProps() {
  const page = await query.Community.findOne({
    where: { name: 'Community Page' },
    query: `values { document } `
  }) as CommunityPage;
  const people = await query.Person.findMany({
    query: `name title blurb remembrance image { publicId } content { document }`, orderBy: {name: 'asc'}
  }) as Person[];

  return {
    props: {
      page,
      people
    }
  };
}