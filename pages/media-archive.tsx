import { InferGetStaticPropsType } from "next";
import { query } from '.keystone/api';
import { InferRenderersForComponentBlocks } from '@keystone-6/fields-document/component-blocks';
import _ from 'lodash';
import { componentBlocks } from '../admin/components/component-blocks';
import Image from '../components/Image';
import create from 'zustand'

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

const useStore = create(set => ({
  currentFilters: [],
  add: (filter: any) => set((state: { currentFilters: string[] }) => { 
      
    const isPresent = state.currentFilters.indexOf(filter) > -1;
    if (!isPresent) state.currentFilters.push(filter);
    
   }),
}))
useStore.subscribe(console.log)

const filterIntersects = (items) => {
    let currentFilters = useStore(state => state.currentFilters);
    // console.log(_.intersection(currentFilters, _.map(item.filters, 'name')))

    return items
    .filter(item => currentFilters.length === 0 || _.isEqual(currentFilters.sort(), _.map(item.filters, 'name').sort()))
    .map((item: MediaItem, i) => (
        <div key={i} className="w-1/3">
            { _.map(item.filters, 'name')}
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
const useStore2 = create(set => ({
    bears: 0,
    increasePopulation: () => set(state => ({ bears: state.bears + 1 })),
    removeAllBears: () => set({ bears: 0 })
  }))
  function BearCounter() {
    const bears = useStore(state => state.currentFilters[0])
    return <h1>{bears} around here ...</h1>
  }
  
  function Controls() {
    const increasePopulation = useStore2(state => state.increasePopulation)
    return <button onClick={increasePopulation}>one up</button>
  }
  
export default function MediaArchive({ filtersGrouped, mediaItems }: InferGetStaticPropsType<typeof getStaticProps>) {
    return (
      <div
      className="container mx-auto mt-14 mb-14 xl:mt-16 flex flex-col md:flex-row items-center font-work-sans text-xl md:text-2xl">
        <div className='w-1/3'>
            {renderFilters(filtersGrouped)}
        </div>
        <div className="flex">
            {BearCounter()} 
            {Controls()}
            {filterIntersects(mediaItems)}
        </div>
      </div>
    );
  }

export async function getStaticProps() {
    const filters = await query.Filter.findMany({ query: 'name type' }) as any[];
    const filtersGrouped = filters.reduce((filterMemo, {type, name}) => {
        (filterMemo[type] = filterMemo[type] || []).push(name);
        return filterMemo;
    }, {})
    const mediaItems = await query.MediaItem.findMany({ query: 'title shortDescription filters { name } thumbnail { publicId }' }) as MediaItem[];
     console.log(mediaItems)
    return {
      props: {
        filtersGrouped,
        mediaItems,
      }
    };
  }