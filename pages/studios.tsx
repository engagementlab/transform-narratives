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
import ImagePlaceholder from "../components/ImagePlaceholder";

const renderItem = (props: { item: MediaItem }) => {
    return (
        <motion.div animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="w-full ml-5">
                {
                    props.item.thumbnail ?
                    <Image id={`thumb-${props.item.key}`} alt={`Thumbnail for studio with name "${props.item.title}"
                    `} imgId={props.item.thumbnail.publicId} lazy={true} className="max-w-s" /> :
                    <ImagePlaceholder imageLabel='Studio' width={335} height={200} />
                }
                <h4 className="text-bluegreen text-lg font-semibold mt-2">{props.item.name}</h4>

                <div className="flex items-start">
                    <div className="w-2/3">
                        <p className="m-0">{props.item.blurb}</p>
                        <p className=" text-bluegreen">{_.map(props.item.filters, 'name').join(', ')}</p>
                    </div>
                    {/* <Button className=" bg-lynx" link= label='See More' /> */}
                    <Link href={`/studios/${props.item.key}`} passHref>
                        <button 
                        className='inline-block rounded-full px-8 py-5 uppercase bg-lynx text-bluegreen border-2 border-bluegreen transition-all hover:bg-bluegreen hover:text-lynx'>
                        See More</button>
                    </Link>
                    </div>
        </motion.div>
    );
}

export default function Studios({ filtersGrouped, studios }: InferGetStaticPropsType<typeof getStaticProps>) {
    return (
        <Layout>
            <div
            className="container mx-auto mt-14 mb-14 xl:mt-16 px-4 xl:px-8">      
                <h2 className="text-2xl text-bluegreen font-semibold">Studios at Emerson College</h2>
            
                <p className="w-full lg:w-1/2 xl:w-1/3">Students and faculty work alongside community partners to co-create narrative interventions to the crisis of gun violence as it is experienced locally. The <i>Transforming Narratives of Gun Violence Initiative</i> is a multi-year initiative and hosts 5-7 studios per year.</p>
                
                {FilteredItems(filtersGrouped, studios, renderItem)} 
            
            </div>
        </Layout>
    );
}

export async function getStaticProps() {
    const filters = await query.Filter.findMany({ where: { section: {equals: 'studio'} }, query: 'name type' }) as any[];
    // Group filters by type
    const filtersGrouped = filters.reduce((filterMemo, {type, name}) => {
        (filterMemo[type] = filterMemo[type] || []).push(name);
        return filterMemo;
    }, {})
    const studios = await query.Studio.findMany({ query: 'name blurb key filters { name } thumbnail { publicId }' }) as MediaItem[];

    return {
      props: {
        filtersGrouped,
        studios,
      }
    };
  }