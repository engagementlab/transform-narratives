import {
    InferGetStaticPropsType
} from "next";
import create from 'zustand';
import _ from 'lodash';
import { motion, AnimatePresence } from "framer-motion"


import {
    query
} from '.keystone/api';
import Image from '../components/Image';
import Link from "next/link";

type Filter = {
    name: string;
    type: string;
};
type MediaItem = {
    title: string;
    key: string;
    shortDescription: string;
    filters: string;
    thumbnail: {
        publicId: string;
    }
}
type FilterState = {
    currentFilters: any[];
    filtersOpen: boolean
    add: (filter: any) => void
    remove: (filters: any[]) => void
    reset: () => void
    toggleOpen: (open: boolean) => void
}
// Create store with Zustand
const useStore = create<FilterState>(set => ({
    currentFilters: [],
    filtersOpen: false,
    add: (filter: any) => set((state) => {
        const isPresent = state.currentFilters.indexOf(filter) > -1;
        if (!isPresent) {
            return {
                ...state,
                currentFilters: [...state.currentFilters, filter]
            }
        }
    }),
    remove: (filters) => set((state) => {
        
        return {
            ...state,
            currentFilters: state.currentFilters.filter(e => !filters.includes(e))
        }
    }),
    reset: () => set({ currentFilters: [] }),
    toggleOpen: (open: boolean) => set({ filtersOpen:open })
}));

const RenderFilters = (filters: { [x: string]: any[]; }) => {
   
    // Store get/set
    const selectedFilters = useStore(state => state.currentFilters);
    const filtersOpen = useStore(state => state.filtersOpen);
    const haveFilters = selectedFilters.length > 0;

    const haveSpecificFilter = (key: string) => {return _.values(selectedFilters).indexOf(key) > -1};
    const addFilter = useStore(state => state.add);
    const reset = useStore(state => state.reset);
    const resetForKey = useStore(state => state.remove);
    const toggleOpen = useStore(state => state.toggleOpen);

    const menu = <div>
                    {Object.keys(filters).map((key) => (
                        <div key={key}>
                            <div className="mt-4 flex items-center flex-shrink-0 flex-grow-0 uppercase">
                                <svg height="10.0" width="14" className='inline transition-transform group-hover:rotate-180'>
                                    <polygon points="0,0 14,0 7.0,9.0" style={{'fill':'#8D33D2'}}></polygon>
                                </svg>
                                <span className="ml-2">    
                                    {key}
                                </span> 
                            </div>
                            <ul>
                                {filters[key].map(filter => {
                                    return (
                                        <li key={filter} className={`mt-4 text-sm font-semibold ${!haveSpecificFilter(filter) ? 'text-bluegreen' : 'text-purple'}`}>
                                            <a href="#" onClick={(e) =>{ addFilter(filter); e.preventDefault() }} className='w-3/4 flex items-center justify-between'>
                                                {filter}
                                                <svg viewBox="185.411 115.41 11 11" width="11" height="11" className="flex-shrink-0" style={{visibility: !haveSpecificFilter(filter) ? 'hidden' : 'visible'}}>
                                                    <path d="M 195.198 115.41 L 190.911 119.695 L 186.624 115.41 L 185.411 116.623 L 189.696 120.91 L 185.411 125.197 L 186.624 126.41 L 190.911 122.125 L 195.198 126.41 L 196.411 125.197 L 192.126 120.91 L 196.411 116.623 Z" className="fill-purple"></path>
                                                </svg>
                                            </a>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    ))}
                </div>;

    return <div> 
            <div className="hidden lg:block">
                <div className="mr-2 flex justify-between">
                    <a onClick={(e) =>{ toggleOpen(true); e.preventDefault() }}>Filters</a>   
                    <a href="#" className="text-bluegreen" onClick={(e) =>{ reset(); e.preventDefault() }}  style={{visibility: !haveFilters ? 'hidden' : 'visible'}}>Clear</a> 
                </div>
                {menu}     
            </div>
            {/* Mobile/tablet */}
            <div className={`lg:hidden block absolute top-0 left-0 h-full z-50 p-20 pt-40 bg-black transition-all ease-in-out ${filtersOpen ? '' : '-translate-x-full'}`}>
                <a className="uppercase" onClick={(e) =>{ toggleOpen(false); e.preventDefault() }}>Close</a>   
                {menu}     
            </div>
        </div>
}

const FilterIntersects = (items: any[]) => {
    
        const selectedFilters = useStore(state => state.currentFilters);
        const haveFilters = selectedFilters.length > 0;
        const reset = useStore(state => state.reset);
        const toggleOpen = useStore(state => state.toggleOpen);
        const filteredItems = items.filter(
                // If selected filters empty, show all...
                item => selectedFilters.length === 0 ||
                // ...otherwise, item's filters must match ALL selected filters
                _.every(selectedFilters, r => _.map(item.filters, 'name').indexOf(r) >= 0));

        return <div>
            <div className="w-full flex justify-between">
                    <a className="uppercase" onClick={(e) =>{ toggleOpen(true); e.preventDefault() }}>Filters</a>   
                    <a className="uppercase" onClick={(e) =>{ reset(); e.preventDefault() }}  style={{visibility: !haveFilters ? 'hidden' : 'visible'}}>(x) Clear</a>   
                    <span className="uppercase">Showing {filteredItems.length} Stories</span>
            </div>
            <div className="xl:flex">{
                        filteredItems.length === 0 ? 
                        <p>No matches!</p> :
                        <AnimatePresence>
                        {filteredItems.map((item, i) => (
                                    <motion.div key={i}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }} className="w-full xl:w-1/3">
                            <Link href={`/media/${item.key}`} passHref>
                                <a>
                                        <Image id={`thumb-${i}`} alt={`Thumbnail for media with name "${item.title}"`} imgId={item.thumbnail.publicId} lazy={true} className="max-w-xs" />
                                        <p>{item.title}</p>
                                        <p>{item.shortDescription}</p>
                                        <p className="uppercase">{_.map(item.filters, 'name').join(', ')}</p>
                                </a>
                            </Link>
                                    </motion.div>
                        ))}
                        </AnimatePresence>
                }
            </div>
        </div>
};

export default function MediaArchive({ filtersGrouped, mediaItems }: InferGetStaticPropsType<typeof getStaticProps>) {
    return (
        <div
        className="container mx-auto mt-14 mb-14 xl:mt-16">
        <h2 className="text-2xl text-bluegreen font-semibold">Media Archive</h2>
        <p className="w-full lg:w-1/3">Students and faculty work alongside community partners to co-create narrative interventions to the crisis of
            gun violence as it is experienced locally. The Transforming Narratives of Gun Violence Initiative is a
            multi-year initiative and hosts 5-7 studios per year.</p>
        <div className="flex">
            <div className='w-1/5 flex-shrink-0 border-r border-[#B9CCC7]'>
                {RenderFilters(filtersGrouped)}
            </div>
            <div className="ml-4">
                {/* {FiltersDebug()} */}
                {FilterIntersects(mediaItems)}
            </div>
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
    const mediaItems = await query.MediaItem.findMany({ query: 'title key shortDescription filters { name } thumbnail { publicId }' }) as MediaItem[];

    return {
      props: {
        filtersGrouped,
        mediaItems,
      }
    };
  }