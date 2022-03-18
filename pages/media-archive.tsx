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
    filtersNavOpen: boolean
    filterGroupsClosed: string[]
    toggle: (filter: any) => void
    toggleFilterGroupClosed: (filterKey: string) => void
    toggleFiltersOpen: (open: boolean) => void
    reset: () => void
}
// Create store with Zustand
const useStore = create<FilterState>(set => ({
    currentFilters: [],
    filtersNavOpen: false,
    filterGroupsClosed: [],
    toggle: (filter: any) => set((state) => {
        return state.currentFilters.includes(filter) ?
        {
            ...state,
            currentFilters: state.currentFilters.filter(e => e !== filter)
        }
        :
        {
            ...state,
            currentFilters: [...state.currentFilters, filter]
        }
    }), 
    toggleFilterGroupClosed: (filterGroupKey: string) => set((state) => {
        return state.filterGroupsClosed.includes(filterGroupKey) ?
        {
            ...state,
            filterGroupsClosed: state.filterGroupsClosed.filter(e => e !== filterGroupKey)
        }
        :
        {
            ...state,
            filterGroupsClosed: [...state.filterGroupsClosed, filterGroupKey]
        }
    }),     
    toggleFiltersOpen: (open: boolean) => set((state) => { 
        document.body.style.overflow = open ? 'hidden' : 'visible';
        if(open) window.scrollTo(0, 0);
        return { ...state, filtersNavOpen:open }; 
    }),
    reset: () => set({ currentFilters: [] }),
}));

const RenderFilters = (filters: { [x: string]: any[]; }) => {
   
    // Store get/set
    const selectedFilters = useStore(state => state.currentFilters);
    const filtersOpen = useStore(state => state.filtersNavOpen);
    const filterGroupsClosed = useStore(state => state.filterGroupsClosed)
    const haveFilters = selectedFilters.length > 0;
    
    const haveSpecificFilter = (key: string) => {return _.values(selectedFilters).includes(key)};
    const haveGroupClosed = (key: string) => {return filterGroupsClosed.includes(key)};
    const toggleFilter = useStore(state => state.toggle);
    const toggleFilterGroupOpen = useStore(state => state.toggleFilterGroupClosed);
    const reset = useStore(state => state.reset);
    const toggleFiltersOpen = useStore(state => state.toggleFiltersOpen);

    const menu = <div>
                    {Object.keys(filters).map((key) => (
                        <div key={key}>
                            <a href="#" className="text-xl xl:text-base" onClick={(e)=>{ toggleFilterGroupOpen(key); e.preventDefault() }}>
                                <div className="mt-4 flex items-center flex-shrink-0 flex-grow-0 uppercase">
                                    <svg height="10.0" width="14" className={`inline transition-transform ${haveGroupClosed(key) ? 'rotate-180' : ''}`}>
                                        <polygon points="0,0 14,0 7.0,9.0" style={{'fill':'#8D33D2'}}></polygon>
                                    </svg>
                                    <span className="ml-2">    
                                        {key}
                                    </span> 
                                </div>
                            </a>
                            <ul className={`relative overflow-hidden transition-all ${haveGroupClosed(key) ? 'max-h-0' : 'max-h-96'}`}>
                                {filters[key].map(filter => {
                                    return (
                                        <li key={filter} className={`mt-4 text-lg xl:text-sm font-semibold
                                            ${!haveSpecificFilter(filter) ? 'text-bluegreen' : 'text-purple' }`}>
                                            <a href="#" onClick={(e)=>{ toggleFilter(filter); e.preventDefault() }}
                                                className='w-3/4 flex items-center justify-between'>
                                                {filter}
                                                <svg viewBox="185.411 115.41 11 11" width="11" height="11"
                                                    className='flex-shrink-0'
                                                    style={{visibility: !haveSpecificFilter(filter) ? 'hidden' : 'visible'}}>
                                                    <path
                                                        d="M 195.198 115.41 L 190.911 119.695 L 186.624 115.41 L 185.411 116.623 L 189.696 120.91 L 185.411 125.197 L 186.624 126.41 L 190.911 122.125 L 195.198 126.41 L 196.411 125.197 L 192.126 120.91 L 196.411 116.623 Z"
                                                        className="fill-purple"></path>
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
                {menu}
            </div>
            {/* Mobile/tablet */}
            <div className={`lg:hidden block w-full absolute overflow-y-scroll top-0 left-0 h-full z-50 p-10 pt-20 bg-lynx
                transition-all ease-[cubic-bezier(0.075, 0.820, 0.165, 1.000)] duration-300 ${filtersOpen ? ''
                : '-translate-y-full' }`}>
                <a className="uppercase w-full flex justify-end" onClick={(e)=>{ toggleFiltersOpen(false);
                    e.preventDefault() }}>
                    <svg viewBox="185.411 115.41 11 11" width="11" height="11" className='flex-shrink-0'>
                        <path
                            d="M 195.198 115.41 L 190.911 119.695 L 186.624 115.41 L 185.411 116.623 L 189.696 120.91 L 185.411 125.197 L 186.624 126.41 L 190.911 122.125 L 195.198 126.41 L 196.411 125.197 L 192.126 120.91 L 196.411 116.623 Z"
                            className="fill-purple"></path>
                    </svg>
                </a>
                {menu}
                <button
                    className="my-4 w-full rounded-large px-6 py-2 uppercase bg-purple text-white transition-all hover:opacity-75"
                    onClick={(e)=>{ toggleFiltersOpen(false) }}>Apply</button>
            </div>
        </div>
}

const FilterIntersects = (items: any[]) => {
    
        const selectedFilters = useStore(state => state.currentFilters);
        const haveFilters = selectedFilters.length > 0;
        const reset = useStore(state => state.reset);
        const toggleFiltersOpen = useStore(state => state.toggleFiltersOpen);
        const filteredItems = items.filter(
                // If selected filters empty, show all...
                item => selectedFilters.length === 0 ||
                // ...otherwise, item's filters must match ALL selected filters
                _.every(selectedFilters, r => _.map(item.filters, 'name').indexOf(r) >= 0));

        return <div>
            <div className="w-full flex flex-col xl:flex-row justify-between">
                {/* Mobile Filters/Clear button */}
                <button
                    className="lg:hidden inline-block rounded-large my-4 px-6 py-2 uppercase bg-purple text-white transition-all hover:opacity-75"
                    onClick={(e)=>{ toggleFiltersOpen(true); e.preventDefault() }}>Filters</button>
                <button
                    className="lg:hidden inline-block rounded-large my-2 px-6 py-2 uppercase bg-purple text-white transition-all hover:opacity-75"
                    onClick={(e)=>{ reset(); e.preventDefault() }}
                    style={{display: !haveFilters ? 'none' : 'block'}}>Clear</button>
                <span className="my-4 uppercase w-full block">Showing {filteredItems.length} Stories</span>
            </div>
            <div className="xl:flex">{
                filteredItems.length === 0 ?
                <p>No matches!</p> :
                        <AnimatePresence>
                            {filteredItems.map((item, i) => (
                                <motion.div key={i} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="w-full xl:w-1/3">
                                    <Link href={`/media/${item.key}`} passHref>
                                    <a>
                                        <Image id={`thumb-${i}`} alt={`Thumbnail for media with name "${item.title}"
                                            `} imgId={item.thumbnail.publicId} lazy={true} className="max-w-xs" />
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
        className="container mx-auto mt-14 mb-14 xl:mt-16 px-4 xl:px-8">
        <h2 className="text-2xl text-bluegreen font-semibold">Media Archive</h2>
        <p className="w-full lg:w-1/3">Students and faculty work alongside community partners to co-create narrative interventions to the crisis of
            gun violence as it is experienced locally. The Transforming Narratives of Gun Violence Initiative is a
            multi-year initiative and hosts 5-7 studios per year.</p>
        <div className="flex">
            <div className='w-0 xl:w-1/5 flex-shrink-0 xl:border-r border-[#B9CCC7]'>
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