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
import create from 'zustand';

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
    const selectedFilters = useStore(state => state.currentFilters);
    const filtersOpen = useStore(state => state.filtersOpen);
    const haveFiltersForKey = (key: string) => {return _.intersection(selectedFilters, filters[key]).length > 0};
    const addFilter = useStore(state => state.add);
    const resetForKey = useStore(state => state.remove);
    const toggleOpen = useStore(state => state.toggleOpen);

    const menu = <div>
                    {Object.keys(filters).map((key) => (
                        <div key={key}>
                            <div className="flex justify-between items-center flex-shrink-0 flex-grow-0">
                                <svg height="10.0" width="14" id="canvas"><polygon points="0,0 14,0 7.0,9.0" style={{'fill':'#FEF9C7'}}></polygon></svg>
                                {key}
                                <a href="#" onClick={(e) =>{ resetForKey(filters[key]); e.preventDefault() }} style={{visibility: !haveFiltersForKey(key) ? 'hidden' : 'visible'}}>x</a>
                            </div>
                            <ul>
                                {filters[key].map(filter => {
                                    return( <li key={filter}><a href="#" onClick={(e) =>{ addFilter(filter); e.preventDefault() }}>{filter}</a></li>)
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
                    <span>Showing {filteredItems.length} Stories</span>
            </div>
            <div className="md:flex">{
                        filteredItems.length === 0 ? 
                        <p>No matches!</p> :
                        filteredItems.map((item, i) => (
                            <div key={i} className="w-full md:w-1/2 lg:w-1/3">
                                    <Image id={`thumb-${i}`} alt={`Thumbnail for media with name "${item.title}"`} imgId={item.thumbnail.publicId} width={235}  />
                                    <p>{item.title}</p>
                                    <p>{item.shortDescription}</p>
                                    <p className="uppercase">{_.map(item.filters, 'name').join(', ')}</p>
                                </div>))
                }
            </div>
        </div>
};

export default function MediaArchive({ filtersGrouped, mediaItems }: InferGetStaticPropsType<typeof getStaticProps>) {
    return (
        <div
        className="container mx-auto mt-14 mb-14 xl:mt-16">
            <div className="w-full"><h2>Media Archive</h2> <hr /></div>
            <div className="flex items-center">
            <div className='w-1/5 border-r'>
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
    const mediaItems = await query.MediaItem.findMany({ query: 'title shortDescription filters { name } thumbnail { publicId }' }) as MediaItem[];

    return {
      props: {
        filtersGrouped,
        mediaItems,
      }
    };
  }