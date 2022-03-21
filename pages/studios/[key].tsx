import { GetStaticPathsResult, GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import { DocumentRenderer, DocumentRendererProps } from '@keystone-6/document-renderer';
import { InferRenderersForComponentBlocks } from '@keystone-6/fields-document/component-blocks'
import Link from 'next/link';
import _ from 'lodash';

import { query } from '.keystone/api';

import Image from '../../components/Image';
import { componentBlocks } from '../../admin/components/component-blocks';
import FlexLayout from '../../components/FlexLayout';
import BlockRenderers from '../../components/BlockRenderers';

type Studio = {
  id: string;
  name: string;
  key: string;
  filters: any[];
  content: any;
};
const renderers: DocumentRendererProps['renderers'] = {
block: {
  heading: ({ level, children, textAlign }) => {
    return <p className={`${level === 3 && 'text-2xl text-bluegreen'} font-semibold`} style={{ textAlign }}>{children}</p>;
  },
  layout: ({layout, children}) => {
    return FlexLayout(layout, children);
  }
},
};

export default function Studio({ item, relatedItems }: InferGetStaticPropsType<typeof getStaticProps>) {
return (
    !item ? 'Not found!' :
  <div>
      <div className='px-4 xl:px-8'>
          <h1 className="text-3xl">{item.name}</h1>
          <p>{_.map(item.filters, 'name').join(', ')}</p>

          <DocumentRenderer document={item.content.document} componentBlocks={BlockRenderers} renderers={renderers} />
          {/* <h3 className='text-2xl text-bluegreen font-semibold'>Explore Related Media</h3> */}

          {relatedItems &&
              <div>
                  <div className='flex flex-col lg:flex-row justify-between items-center'>
                      <p>Browse similar Studio courses from the same course series, professor, or media.</p>
                      <Link href='/media-archive' passHref>
                          <a>
                              See All
                          </a>
                      </Link>
                  </div>
                  <div className='flex flex-col lg:flex-row'>
                      {/* {relatedItems.map((relatedItem, i) => (
                          <Link key={i} href={`/media/${relatedItem.key}`} passHref>
                              <a className="w-full lg:w-1/3">
                                  <div>
                                      <Image id={`thumb-${i}`} alt={`Thumbnail for media with name "${relatedItem.name}"`} imgId={relatedItem.thumbnail.publicId} width={302}  />
                                      <h4 className='text-xl font-semibold mt-3'>{relatedItem.name}</h4>
                                      
                                      <p>{_.map(relatedItem.filters, 'name').join(', ')}</p>
                                  </div>
                              </a>
                          </Link>
                      ))} */}
                  </div>
              </div>
          }
      </div>
  </div>
);
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const items = (await query.Studio.findMany({
    query: `key`,
  })) as { key: string }[];

  const paths = items
    .filter(({ key }) => !!key)
    .map(({ key }) => `/studios/${key}`);

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const item = (await query.Studio.findOne({
      where: { key: params!.key as string },
      query: 'name filters { name } content { document(hydrateRelationships: true) }',
  })) as Studio;
  const relatedItems = (await query.Studio.findMany({
      query: 'name key filters { type name } thumbnail { publicId }',
  })) as Studio[];
  return { props: { item, relatedItems } };
}