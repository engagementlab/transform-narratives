import {
    GetStaticPathsResult,
    GetStaticPropsContext,
    InferGetStaticPropsType
} from 'next';

import {
    useRouter
} from 'next/router';
import {
    DocumentRenderer,
    DocumentRendererProps
} from '@keystone-6/document-renderer';
import {
    query
} from '.keystone/api';

import _ from 'lodash';
import create from 'zustand';
import {
    CopyToClipboard
} from 'react-copy-to-clipboard';

import Video from '../../components/Video';
import FlexLayout from '../../components/FlexLayout';
import BlockRenderers from '../../components/BlockRenderers';
import Layout from '../../components/Layout';
import HeadingStyle from '../../components/HeadingStyle';

type MediaItem = {
    title: string;
    key: string;
    content: any;
    shortDescription: string;
    filters: any[];
    videos: any[];
    thumbnail: {
        publicId: string;
    }
}
type ShareState = {
    urlCopied: boolean;
    toggleCopied: (open: boolean) => void
}
// Create store with Zustand
const useStore = create < ShareState > (set => ({
    urlCopied: false,
    toggleCopied: (open: boolean) => set({
        urlCopied: open
    })
}));

const renderers: DocumentRendererProps['renderers'] = {
    block: {
        heading: ({
            level,
            children,
            textAlign
        }) => {
            return HeadingStyle(level, children, textAlign);
        },
        layout: ({
            layout,
            children
        }) => {
            return FlexLayout(layout, children);
        }
    },
};

export default function MediaItem({
    item,
    relatedItems
}: InferGetStaticPropsType < typeof getStaticProps > ) {
    const thisUrl = `https://transformnarratives.org${useRouter().asPath}`;
    const toggleCopied = useStore(state => state.toggleCopied);
    const wasCopied = useStore(state => state.urlCopied);
    return (
      !item ? 'Not found!' :
        <Layout>
            <div>
                <div className='pt-7 text-white bg-coated'>
                {item.videos && <Video videoLabel={item.videos[0].label} videoUrl={item.videos[0].value} thumbUrl={item.videos[0].thumb} />}
                    <div className='flex justify-between px-8 py-10'>
                        <div>
                            <h1 className="text-2xl font-semibold">{item.title}</h1>
                            <p>{_.map(item.filters, 'name').join(', ')}</p>
                        </div>
                        <div>
                            <CopyToClipboard text={thisUrl} onCopy={()=> toggleCopied(true)}>
                                <button disabled={wasCopied} className={`inline-block rounded-full px-10 py-7 uppercase
                                    border-2 border-oasis text-white transition-all ${!wasCopied && 'hover:opacity-75' }`}>
                                    {!wasCopied ? 'Share' : 'Copied URL!'}
                                </button>
                            </CopyToClipboard>
                        </div>
                    </div>
                </div>
                <div className='px-4 xl:px-8'>
                    <DocumentRenderer document={item.content.document} componentBlocks={BlockRenderers} renderers={renderers} />
                    {/*
                    <h3 className='text-2xl text-bluegreen font-semibold'>Explore Related Media</h3>

                     {relatedItems &&
                        <div>
                        <div className='flex flex-col lg:flex-row justify-between items-center'>
                        <p>Browse other stories to keep learning</p>
                        <Link href='/media-archive' passHref>
                        <a>
                        See All
                        </a>
                        </Link>
                        </div>
                        <div className='flex flex-col lg:flex-row'>
                        {relatedItems.map((relatedItem, i) => (
                            <Link key={i} href={`/media/${relatedItem.key}`} passHref>
                            <a className="w-full lg:w-1/3">
                            <div>
                            <Image id={`thumb-${i}`} alt={`Thumbnail for media with name "${relatedItem.title}"`} imgId={relatedItem.thumbnail.publicId} width={302}  />
                            <h4 className='text-xl font-semibold mt-3'>{relatedItem.title}</h4>
                            
                            <p className='text-base'>{relatedItem.shortDescription}</p>
                            <p>{_.map(relatedItem.filters, 'name').join(', ')}</p>
                            </div>
                            </a>
                            </Link>
                            ))}
                            </div>
                            </div>
                        } */}
                </div>
            </div>
        </Layout>
  );
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
    const items = (await query.MediaItem.findMany({
      query: `key`,
    })) as { key: string }[];
  
    const paths = items
      .filter(({ key }) => !!key)
      .map(({ key }) => `/archive/${key}`);
  
    return {
      paths,
      fallback: false,
    };
}
  
export async function getStaticProps({ params }: GetStaticPropsContext) {
    const item = (await query.MediaItem.findOne({
        where: { key: params!.key as string },
        query: 'title filters { name } content { document(hydrateRelationships: true) } videos thumbnail { publicId }',
    })) as MediaItem;
    const relatedItems = (await query.MediaItem.findMany({
        where: { 
            filters: { 
                some:{
                    OR: [
                        { name: { equals: "2022" } },
                        { name: { equals: "Rural Voices" } }
                    ]
                } 
            }
        },
        query: 'title key filters { type name } shortDescription thumbnail { publicId }',
    })) as MediaItem[];
    return { props: { item, relatedItems } };
}