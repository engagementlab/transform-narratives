import {
    InferGetStaticPropsType
} from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import _ from 'lodash';
import {
    motion
} from "framer-motion";

import {
    query
} from '.keystone/api';
import Filtering, {  MediaItem } from "../components/Filtering";
import Image from "../components/Image";
import Layout from "../components/Layout";
import ImagePlaceholder from "../components/ImagePlaceholder";

const renderItem = (props: {
        item: MediaItem
    }) => {
        const btnClass = 'inline-block rounded-full px-8 py-5 uppercase bg-lynx text-bluegreen border-2 border-bluegreen transition-all hover:bg-bluegreen hover:text-lynx group-hover:bg-bluegreen group-hover:text-lynx';
        return (
            <Link href={`/studios/${props.item.key}`} passHref>
                <motion.div animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="ml-5 cursor-pointer group">
                    {
                        props.item.thumbnail ?
                        <Image id={`thumb-${props.item.key}`} alt={`Thumbnail for studio with name "${props.item.title}"
                        `} imgId={props.item.thumbnail.publicId} lazy={true} className="max-w-s" /> :
                        <ImagePlaceholder imageLabel='Studio' width={716} height={200} />
                    }
                    <h4 className="text-bluegreen text-lg font-semibold mt-2">{props.item.name}</h4>

                    <div className="flex items-start">
                        <div className="w-2/3">
                            <p className="m-0">{props.item.blurb}</p>
                            <p className=" text-bluegreen">{_.map(props.item.filters, 'name').join(', ')}</p>
                        </div>
                        <button
                            className={btnClass}>
                            See More</button>
                    </div>
                </motion.div>
            </Link>
    );
}

export default function Studios({ filtersGrouped, studios }: InferGetStaticPropsType<typeof getStaticProps>) {
    const router = useRouter();
    const preSelectedFilters = Object.keys(router.query).length === 1 ? Object.keys(router.query)[0].split('/') as never[] : [];
    const filtering = new Filtering(filtersGrouped, preSelectedFilters, studios, renderItem);
    
    return (
        <Layout>
            <div
            className="container mt-14 mb-14 xl:mt-16 px-4 xl:px-8">      
                <h2 className="text-2xl text-bluegreen font-semibold">Studios at Emerson College</h2>
            
                <p className="w-full lg:w-1/2 xl:w-1/3">Students and faculty work alongside community partners to co-create narrative interventions to the crisis of gun violence as it is experienced locally. The <i>Transforming Narratives of Gun Violence Initiative</i> is a multi-year initiative and hosts 5-7 studios per year.</p>
                <filtering.FilteredItems />
            
            </div>
        </Layout>
    );
}

export async function getStaticProps() {
    const filters = await query.Filter.findMany({ where: { section: {equals: 'studio'} }, query: 'key name type' }) as any[];
    // Group filters by type
    const filtersGrouped = filters.reduce((filterMemo, {key, type, name}) => {
        (filterMemo[type] = filterMemo[type] || []).push({key, name});
        return filterMemo;
    }, {})
    const studios = await query.Studio.findMany({ query: 'name blurb key filters { key name } thumbnail { publicId }' }) as MediaItem[];

    return {
      props: {
        filtersGrouped,
        studios,
      }
    };
  }