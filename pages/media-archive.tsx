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
  add: (filter: any) => void
  reset: () => void
}

// Create store with Zustand
const useStore = create<FilterState>(set => ({
    currentFilters: [],
    add: (filter: any) => set((state) => {
        const isPresent = state.currentFilters.indexOf(filter) > -1;
        if (!isPresent) {
            return {
                ...state,
                currentFilters: [...state.currentFilters, filter]
            }
        }
    }),
    //    remove:
    reset: () => set({ currentFilters: [] })
}));
// useStore.subscribe(console.log)

const FilterIntersects = (items: any[]) => {
        const currentFilters = useStore(state => state.currentFilters);
        const filteredItems = items.filter(
                // If selected filters empty, show all...
                item => currentFilters.length === 0 ||
                // ...otherwise, item's filters must match ALL selected filters
                _.every(currentFilters, r => _.map(item.filters, 'name').indexOf(r) >= 0));
        return <>{
                filteredItems.length === 0 ? 
                    <p>No matches!</p> :
                    filteredItems.map((item, i) => (
                        <div key={i} className="w-1/3">
                            <Image id={`thumb-${i}`} alt={`Thumbnail for media with name "${item.title}"`} imgId={item.thumbnail.publicId} width={235}  />
                            <p>{item.title}</p>
                            <p>{item.shortDescription}</p>
                        </div>))
        }</>
};

const RenderFilters = (filters: { [x: string]: any[]; }) => {
    const haveFilters = useStore(state => state.currentFilters).length > 0;
    const addFilter = useStore(state => state.add);
    const reset = useStore(state => state.reset);
    return <div>
            <a className="uppercase" onClick={(e) =>{ reset(); e.preventDefault() }} style={{visibility: !haveFilters ? 'hidden' : 'visible'}}>(x) Clear</a>

                {Object.keys(filters).map((key) => (
                    <div key={key}>
                        <p className="uppercase">
                            {key}
                        </p>
                        <ul>
                            {filters[key].map(filter => {
                                return( <li key={filter}><a href="#" onClick={(e) =>{ addFilter(filter); e.preventDefault() }}>{filter}</a></li>)
                            })}
                        </ul>
                    </div>
                ))}
        </div>
}
export default function MediaArchive({ filtersGrouped, mediaItems }: InferGetStaticPropsType<typeof getStaticProps>) {
    return (
        <div
        className="container mx-auto mt-14 mb-14 xl:mt-16 flex flex-col md:flex-row items-center font-work-sans text-xl md:text-2xl">
            <div className='w-1/3'>
                {RenderFilters(filtersGrouped)}
            </div>
            <div className="flex">
                {/* {FiltersDebug()} */}
                {FilterIntersects(mediaItems)}
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