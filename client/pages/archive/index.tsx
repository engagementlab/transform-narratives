import {
    InferGetStaticPropsType
} from "next";
import Link from "next/link";
import _ from 'lodash';
import { motion } from "framer-motion";

import {
    query
} from '.keystone/api';
import Filtering, {  MediaItem } from "../../components/Filtering";
import Image from "../../components/Image";
import Layout from "../../components/Layout";
import ImagePlaceholder from "../../components/ImagePlaceholder";
import { useRouter } from "next/router";

const renderItem = (props: { item: MediaItem }) => {
    return (
        <motion.div animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="w-full">
            <Link href={`/archive/${props.item.key}`} passHref>
                <a>
                    {
                        props.item.thumbnail ?
                        <Image id={`thumb-${props.item.key}`} alt={`Thumbnail for media with name "${props.item.title}"
                            `} imgId={props.item.thumbnail.publicId} lazy={true} className="w-full" /> :
                        <ImagePlaceholder imageLabel='Media' width={335} height={200} />
                    }
                    <h3 className="text-bluegreen text-xl font-semibold mt-4 hover:text-green-blue group-hover:text-green-blue">{props.item.title}</h3>
                    <div className="mt-2 mb-20">
                      <p className="m-0">{props.item.shortDescription}</p>
                      <p className="text-bluegreen">{_.map(props.item.filters, 'name').join(', ')}</p>
                    </div>
                </a>
            </Link>

        </motion.div>
    );
}

export default function MediaArchive({ filtersGrouped, mediaItems }: InferGetStaticPropsType<typeof getStaticProps>) {
    const router = useRouter();
    const preSelectedFilters = Object.keys(router.query).length === 1 ? Object.keys(router.query)[0].split('/') as never[] : [];
    const filtering = new Filtering(filtersGrouped, preSelectedFilters, mediaItems, renderItem, 'media');
    return (
        <Layout>
            <div
            className="container mt-14 mb-14 xl:mt-16 px-4 xl:px-8">
                <h2 className="text-2xl text-bluegreen font-semibold mb-8">Media Archive</h2>

                <p className="w-full lg:w-1/2 mb-14">Students and faculty work alongside community partners to co-create narrative interventions to the crisis of
                    gun violence as it is experienced locally. The Transforming Narratives of Gun Violence Initiative is a
                    multi-year initiative and hosts 5-7 studios per year.</p>
                <filtering.FilteredItems />

            </div>
        </Layout>
    );
}

export async function getStaticProps() {
    const filters = await query.Filter.findMany({ where: { section: {equals: 'media'} }, query: 'key name type' }) as any[];
    // Group filters by type
    const filtersGrouped = filters.reduce((filterMemo, {type, key, name}) => {
        (filterMemo[type] = filterMemo[type] || []).push({key, name});
        return filterMemo;
    }, {});
    const mediaItems = await query.MediaItem.findMany({ query: 'title key shortDescription filters { key name } thumbnail { publicId }' }) as MediaItem[];

    return {
      props: {
        filtersGrouped,
        mediaItems,
      }
    };
  }
