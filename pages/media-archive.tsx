import {
    InferGetStaticPropsType
} from "next";
import Link from "next/link";
import _ from 'lodash';
import { motion } from "framer-motion";

import {
    query
} from '.keystone/api';
import FilteredItems, { MediaItem } from "../components/Filtering";
import Image from "../components/Image";
import Layout from "../components/Layout";

const renderItem = (props: { item: MediaItem }) => {
    return (
        <motion.div animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="w-full xl:w-1/4">
            <Link href={`/media/${props.item.key}`} passHref>
            <a>
                <Image id={`thumb-${props.item.key}`} alt={`Thumbnail for media with name "${props.item.title}"
                    `} imgId={props.item.thumbnail.publicId} lazy={true} className="max-w-xs" />
                <p>{props.item.title}</p>
                <p>{props.item.shortDescription}</p>
                <p className="uppercase">{_.map(props.item.filters, 'name').join(', ')}</p>
            </a>
            </Link>
        </motion.div>
    );
}

export default function MediaArchive({ filtersGrouped, mediaItems }: InferGetStaticPropsType<typeof getStaticProps>) {
    return (
        <Layout>

        <div
        className="container mx-auto mt-14 mb-14 xl:mt-16 px-4 xl:px-8">      
            <h2 className="text-2xl text-bluegreen font-semibold">Media Archive</h2>
        
            <p className="w-full lg:w-1/2 xl:w-1/3">Students and faculty work alongside community partners to co-create narrative interventions to the crisis of
                gun violence as it is experienced locally. The Transforming Narratives of Gun Violence Initiative is a
                multi-year initiative and hosts 5-7 studios per year.</p>
            
            {FilteredItems(filtersGrouped, mediaItems, renderItem)} 
           
        </div>
        </Layout>
    );
}

export async function getStaticProps() {
    const filters = await query.Filter.findMany({ where: { section: {equals: 'media'} }, query: 'name type' }) as any[];
    // Group filters by type
    const filtersGrouped = filters.reduce((filterMemo, {type, name}) => {
        (filterMemo[type] = filterMemo[type] || []).push(name);
        return filterMemo;
    }, {})
    const mediaItems = await query.MediaItem.findMany({ query: 'title key shortDescription filters { name } thumbnail { publicId }' }) as MediaItem[];

    return {
      props: {
        filtersGrouped,
        mediaItems,
      }
    };
  }