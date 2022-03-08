import { InferGetStaticPropsType } from "next";
import { query } from '.keystone/api';

import { InferRenderersForComponentBlocks } from '@keystone-6/fields-document/component-blocks';
import Image from '../components/Image';
import { componentBlocks } from '../admin/components/component-blocks';

type Filter = {
    name: string;
    type: string;    
};
type MediaItem = {
    title: string;
    shortDescription: string;
    filters: string;
    thumbnail: {
        publicId: string;
    }
}
  
export default function MediaArchive({ filters, mediaItems }: InferGetStaticPropsType<typeof getStaticProps>) {
    return (
      <div
      className="container mx-auto mt-14 mb-14 xl:mt-16 flex flex-col md:flex-row items-center font-work-sans text-xl md:text-2xl">
        <div className='w-1/3'>

        </div>
        <div className="flex">
            {mediaItems.map((item: MediaItem, i) => (
                <div key={i} className="w-1/3">
                    <Image id={`thumb-${i}`} alt={`Thumbnail for media "${item.title}"`} imgId={item.thumbnail.publicId} width={235}  />
                    <p>{item.title}</p>
                    <p>{item.shortDescription}</p>
                </div>
            ))}
        </div>
      </div>
    );
  }



export async function getStaticProps() {
    const filters = await query.Filter.findMany({ query: 'name type' }) as Filter[];
    const mediaItems = await query.MediaItem.findMany({ query: 'title shortDescription filters { name } thumbnail { publicId }' }) as MediaItem[];
    
    return {
      props: {
        filters,
        mediaItems,
      }
    };
  }