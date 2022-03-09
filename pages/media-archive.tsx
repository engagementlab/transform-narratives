import {
    InferGetStaticPropsType
} from "next";
import {
    query
} from '.keystone/api';
import {
    InferRenderersForComponentBlocks
} from '@keystone-6/fields-document/component-blocks';
import _ from 'lodash';
import {
    componentBlocks
} from '../admin/components/component-blocks';
import Image from '../components/Image';
import create from 'zustand'
import {
    Key
} from "react";

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

// Create store with Zustand
const useStore = create(set => ({
    currentFilters: [],
    add: (filter: any) => set((state: {
        currentFilters: string[]
    }) => {

        const isPresent = state.currentFilters.indexOf(filter) > -1;
        if (!isPresent) state.currentFilters.push(filter);

    }),
    //    remove:
    // reset:
}));

const filterIntersects = (items: any[]) => {
        let currentFilters = useStore(state => state.currentFilters);

        return items
            .filter((item: {
                    filters: _.Dictionary < unknown > | _.NumericDictionary < unknown > | null | undefined;
                }) => currentFilters.length === 0 ||
                _.map(item.filters, 'name').some(r => currentFilters.indexOf(r) >= 0))

            .map((item: MediaItem, i: Key | null | undefined) => (
        <div key={i} className="w-1/3">
            <Image id={`thumb-${i}`} alt={`Thumbnail for media "${item.title}"`} imgId={item.thumbnail.publicId} width={235}  />
            <p>{item.title}</p>
            <p>{item.shortDescription}</p>
        </div>
    ))
};

const renderFilters = (filters: { [x: string]: any[]; }) => {
    const addFilter = useStore(state => state.add);
    return Object.keys(filters).map((key) => (
        <div key={key}>
            <p>
                {key}
            </p>
            <ul>
                {filters[key].map(filter => {
                    return( <li key={filter}><a href="#" onClick={() => addFilter(filter)}>{filter}</a></li>)
                })}
            </ul>
        </div>
    ));
}

export default function MediaArchive({ filtersGrouped, mediaItems }: InferGetStaticPropsType<typeof getStaticProps>) {
    return (
        <div
        className="container mx-auto mt-14 mb-14 xl:mt-16 flex flex-col md:flex-row items-center font-work-sans text-xl md:text-2xl">
            <div className='w-1/3'>
                {renderFilters(filtersGrouped)}
            </div>
            <div className="flex">
                {filterIntersects(mediaItems)}
            </div>
        </div>
    );
}

export async function getStaticProps() {
    const filters = await query.Filter.findMany({ query: 'name type' }) as any[];
    // Group filters by type
    const filtersGrouped = filters.reduce((filterMemo, {type, name}) => {
        (filterMemo[type] = filterMemo[type] || []).push(name);
        return filterMemo;
    }, {})
    const mediaItems = await query.MediaItem.findMany({ query: 'title shortDescription filters { name } thumbnail { publicId }' }) as MediaItem[];

    return {
      props: {
        filtersGrouped,
        mediaItems,
      }
    };
  }