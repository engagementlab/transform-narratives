import { GetStaticPathsResult, GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import { DocumentRenderer, DocumentRendererProps } from '@keystone-6/document-renderer';
import Link from 'next/link';
import _ from 'lodash';

import { query } from '.keystone/api';

import Image from '../../components/Image';
import FlexLayout from '../../components/FlexLayout';
import BlockRenderers from '../../components/BlockRenderers';
import Layout from '../../components/Layout';

type NewsItem = {
  title: string;
  publishDate: string;
  body: any;
  thumbnail: any;
  thumbAltText: string;
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

export default function NewsItem({ item, relatedItems }: InferGetStaticPropsType<typeof getStaticProps>) {
    return (
    !item ? 'Not found!' :
    <Layout>
        <div>
            <Image id='header-img' alt={item.thumbAltText} imgId={item.thumbnail.publicId} />
            <div className='px-4 xl:px-8'>
                <h1 className="text-coated text-2xl font-extrabold mt-5">{item.title}</h1>
                <div className="text-coated font-medium">
                    {new Date(item.publishDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                    })}, {new Date(item.publishDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                    })}, {new Date(item.publishDate).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </div>
                <DocumentRenderer document={item.body.document} componentBlocks={BlockRenderers} renderers={renderers} />

                {relatedItems &&
                    <div>
                    <h3 className='text-2xl text-bluegreen font-semibold'>Explore Related Media</h3>
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
                    </div>
                }
            </div>
        </div>
    </Layout>
    );
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const items = (await query.NewsItem.findMany({
    query: `key`,
  })) as { key: string }[];

  const paths = items
    .filter(({ key }) => !!key)
    .map(({ key }) => `/news/${key}`);

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const item = (await query.NewsItem.findOne({
      where: { key: params!.key as string },
      query: 'title publishDate thumbnail { publicId } thumbAltText body { document(hydrateRelationships: true) }',
  })) as NewsItem;
  const relatedItems = null;
  
  return { props: { item, relatedItems } };
}