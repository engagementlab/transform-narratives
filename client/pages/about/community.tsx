import { InferGetStaticPropsType } from 'next';
import { query } from '.keystone/api';
import { DocumentRenderer, DocumentRendererProps } from '@keystone-6/document-renderer';

import BlockRenderers from '../../components/BlockRenderers';
import Image from '../../components/Image';
import Layout from '../../components/Layout';
import ImagePlaceholder from '../../components/ImagePlaceholder';
import HeadingStyle from '../../components/HeadingStyle';
import DocRenderers from '../../components/DocRenderers';
import { ReactNode } from 'react';

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

const rendererOverrides = {
    heading: (level: number, children: ReactNode, textAlign: any) => {

      const customRenderers = {
        4: 'text-xl font-semibold text-coated my-8',
        5: 'text-lg font-extrabold text-purple'
      };
      return HeadingStyle(level, children, textAlign, customRenderers);
  },
};

export default function Community({ page, people }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout>
      <div>
          <div
          className="container mt-14 mb-14 xl:mt-16 px-4 xl:px-8">
              <h2 className="text-2xl text-bluegreen font-semibold">About Our Community</h2>
              <DocumentRenderer document={page.values.document} renderers={DocRenderers(rendererOverrides)} componentBlocks={BlockRenderers()} />
          </div>
          <div className='container mt-14 mb-24 xl:mt-16 px-4 xl:px-8'>
              <hr className='border-sorbet' />
              <h2 className="text-xl text-coated font-semibold mt-14 mb-12">Our Community</h2>

              {people.map((person, i) => (
                <div key={i} className='flex flex-col lg:flex-row mt-5'>
                      <div className='flex-shrink-0'>
                          {person.image ?
                            <Image id={`thumb-${i}`} alt={`Thumbnail for person with name "${person.name}"`} imgId={person.image.publicId} width={300} /> :
                            <ImagePlaceholder imageLabel='Bio' width={300} height={300} />
                          }
                      </div>
                      <div className='lg:ml-6 w-full lg:w-1/2 xl:w-1/3'>
                          <h3 className='text-xl font-semibold text-coated'>{person.name}</h3>
                          <p className="mt-2 mb-8">{person.title}</p>
                            {person.blurb && (
                              <p>
                                <span className="text-coated font-semibold">
                                What brings you here?
                                </span>
                                <br />
                                {person.blurb}
                              </p>
                            )}
                            {person.remembrance && (
                              <p className="text-green-blue font-semibold">
                                Engaged in remembrance of {person.remembrance}.
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
    query: `name title blurb remembrance image { publicId } content { document }`, orderBy: {name: 'asc'}, where: { enabled: { equals: true } },
  }) as Person[];

  return {
    props: {
      page,
      people
    }
  };
}