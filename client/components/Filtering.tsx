import React from "react";
import create, { Mutate, GetState, SetState, StoreApi, UseBoundStore, State } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import _ from 'lodash';
import { AnimatePresence } from "framer-motion"

export type MediaItem = {
    title: string;
    key: string;
    shortDescription: string;
    filters: string;
    thumbnail: {
        publicId: string;
    }
}
export type StudioItem = {
    name: string;
    key: string;
    blurb: string;
    filters: string;
    thumbnail: {
        publicId: string;
    }
}
type ItemRendererProps = {
    item: MediaItem & StudioItem;
}
type FilterState = {
    currentFilters: never[];
    filtersNavOpen: boolean
    filterGroupsClosed: never[]
    toggle: (filter: any) => void
    toggleFilterGroupClosed: (filterKey: string) => void
    toggleFiltersOpen: (open: boolean) => void
    reset: () => void
}

// Replicated from https://github.com/pmndrs/zustand/blob/a418fd748077c453efbff2d03641ce0af780b3c7/src/middleware/subscribeWithSelector.ts
interface StoreSubscribeWithSelector<T extends State> {
    subscribe: {
      (listener: (selectedState: T, previousSelectedState: T) => void): () => void
      <U>(
        selector: (state: T) => U,
        listener: (selectedState: U, previousSelectedState: U) => void,
        options?: {
          equalityFn?: (a: U, b: U) => boolean
          fireImmediately?: boolean
        }
      ): () => void
    }
  }
  
export default class Filtering {

    useStore: UseBoundStore<FilterState, Omit<StoreApi<FilterState>, "subscribe"> & StoreSubscribeWithSelector<FilterState>>;
    filtersGrouped: {[x: string]: any[]};
    items;
    mode?: string;
    ItemRenderer: React.ComponentType < ItemRendererProps >;

    constructor(filtersGrouped: {
        [x: string]: any[];
    }, preSelectedFilters: never[], items: any[], ItemRenderer: React.ComponentType < ItemRendererProps >, mode?: string ) {

        this.filtersGrouped = filtersGrouped;
        this.items = items;
        this.ItemRenderer = ItemRenderer;
        this.mode = mode;

        // Create store with Zustand
        this.useStore = create<
            FilterState,
            SetState<FilterState>,
            GetState<FilterState>,
            Mutate<StoreApi<FilterState>, [["zustand/subscribeWithSelector", never]]>
            >(
                subscribeWithSelector((set) => ({
                    // If defined, pre-populate filter store
                    currentFilters: preSelectedFilters || [],
                    filtersNavOpen: false as boolean,
                    filterGroupsClosed: [] as never[],
                    toggle: (filter: any) => set((state) => {
                        return state.currentFilters.includes(filter as never) ?
                        {
                            ...state,
                            currentFilters: state.currentFilters.filter(e => e !== filter)
                        }
                        :
                        {
                            ...state,
                            currentFilters: [...state.currentFilters, filter as never]
                        }
                    }), 
                    toggleFilterGroupClosed: (filterGroupKey: string) => set((state) => {
                        return state.filterGroupsClosed.includes(filterGroupKey as never) ?
                        {
                            ...state,
                            filterGroupsClosed: state.filterGroupsClosed.filter(e => e !== filterGroupKey as never)
                        }
                        :
                        {
                            ...state,
                            filterGroupsClosed: [...state.filterGroupsClosed, filterGroupKey as never]
                        }
                    }),     
                    toggleFiltersOpen: (open: boolean) => set((state) => { 
                        document.body.style.overflow = open ? 'hidden' : 'visible';
                        if(open) window.scrollTo(0, 0);
                        return { ...state, filtersNavOpen:open }; 
                    }),
                    reset: () => set({ currentFilters: [] }),
                }))
            );
        this.useStore.subscribe(state => state.currentFilters, (current) => {
            history.replaceState({}, 'Filtered Data', `${location.pathname}?${current.join('/')}`);
        });

    }

    private RenderFilters(filters: { [x: string]: any[]; }) {
    
        // Store get/set
        const selectedFilters = this.useStore(state => state.currentFilters);
        const filtersOpen = this.useStore(state => state.filtersNavOpen);
        const filterGroupsClosed = this.useStore(state => state.filterGroupsClosed)
        const haveFilters = selectedFilters.length > 0;
        
        const haveSpecificFilter = (key: string) => {return _.values(selectedFilters).includes(key as never)};
        const haveGroupClosed = (key: string) => {return filterGroupsClosed.includes(key as never)};
        const toggleFilter = this.useStore(state => state.toggle);
        const toggleFilterGroupOpen = this.useStore(state => state.toggleFilterGroupClosed);
        const toggleFiltersOpen = this.useStore(state => state.toggleFiltersOpen);
        const reset = this.useStore(state => state.reset);

        const menu = <div>
                        {Object.keys(filters).map((key) => (
                            <div key={key}>
                                <a href="#" className="text-xl xl:text-base" onClick={(e)=>{ toggleFilterGroupOpen(key); e.preventDefault() }}>
                                    <div className="mt-4 flex items-center flex-shrink-0 flex-grow-0 uppercase">
                                        <svg height="10.0" width="14" className={`inline transition-transform ${haveGroupClosed(key) ? 'rotate-180' : ''}`}>
                                            <polygon points="0,0 14,0 7.0,9.0" style={{'fill':'#8D33D2'}}></polygon>
                                        </svg>
                                        <span className="ml-2 text-coated text-lg xl:text-sm font-semibold">
                                            {key}
                                        </span> 
                                    </div>
                                </a>
                                <ul className={`relative overflow-hidden transition-all ${haveGroupClosed(key) ? 'max-h-0' : 'max-h-auto'}`}>
                                    {filters[key].map(filter => {
                                        return (
                                            <li key={filter.key} className={`text-lg xl:text-sm font-semibold my-8 xl:my-4
                                                ${!haveSpecificFilter(filter.key) ? 'text-bluegreen' : 'text-purple' }`}>
                                                <a href="#" onClick={(e)=>{ toggleFilter(filter.key); e.preventDefault() }}
                                                    className='w-full flex items-center justify-between'>
                                                    {filter.name}
                                                    <svg viewBox="185.411 115.41 11 11" width="11" height="11"
                                                        className='flex-shrink-0 mx-6'
                                                        style={{visibility: !haveSpecificFilter(filter.key) ? 'hidden' : 'visible'}}>
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

        return(<div> 
                {/* Tablet portrait+ */}
                <div className="hidden lg:block">
                    <div className="mr-4 flex justify-between">
                        <span>Filters</span>
                        <a href="#" className="text-bluegreen" onClick={(e) =>{ reset(); e.preventDefault() }}  style={{visibility: !haveFilters ? 'hidden' : 'visible'}}>Clear</a>
                    </div>
                    {menu}
                </div>
                {/* Mobile/tablet */}
                <div className={`lg:hidden block w-full absolute overflow-y-scroll top-0 left-0 h-full z-50 p-10 pt-20 bg-lynx
                    transition-all ease-[cubic-bezier(0.075, 0.820, 0.165, 1.000)] duration-300 ${filtersOpen ? ''
                    : '-translate-y-full' }`}>
                    <a className="uppercase w-full flex justify-end cursor-pointer text-bluegreen" onClick={(e)=>{ toggleFiltersOpen(false);
                        e.preventDefault() }}>
                        <svg viewBox="185.411 115.41 11 11" width="11" height="11" className='flex-shrink-0 my-1.5 mx-3'>
                            <path
                                d="M 195.198 115.41 L 190.911 119.695 L 186.624 115.41 L 185.411 116.623 L 189.696 120.91 L 185.411 125.197 L 186.624 126.41 L 190.911 122.125 L 195.198 126.41 L 196.411 125.197 L 192.126 120.91 L 196.411 116.623 Z"
                                className="fill-bluegreen"></path>
                        </svg>
                        Close Filters
                    </a>
                    {menu}
                    <button
                        className="my-4 w-full rounded-full px-8 py-5 uppercase bg-purple text-white transition-all hover:opacity-75"
                        onClick={(e)=>{ toggleFiltersOpen(false) }}>Apply Filters</button>
                </div>
            </div>);

    };
    
    FilteredItems = () => {
        
            let selectedFilters = this.useStore(state => state.currentFilters);

            const haveFilters = selectedFilters.length > 0;
            const reset = this.useStore(state => state.reset);
            const toggleFiltersOpen = this.useStore(state => state.toggleFiltersOpen);
            const filteredItems = this.items.filter(
                // If selected filters empty, show all...
                item => selectedFilters.length === 0 ||
                // ...otherwise, item's filters must match ALL selected filters
                _.every(selectedFilters, r => _.map(item.filters, 'key').indexOf(r) >= 0));

            const count = filteredItems.length;
            // Decide plural of item count
            const showing = `Showing ${count} ${this.mode === 'media' ?
                                    `Stor${count === 1 ? 'y' : 'ies'}` :
                                    `Studio${count === 1 ? '' : 's'}`}`;

            return <div className="flex">
                <div className='w-0 lg:w-1/5 flex-shrink-0 lg:border-r border-sorbet'>
                    {this.RenderFilters(this.filtersGrouped)}
                </div>

                <div className="w-full">
                    {/* Mobile Filters/Clear button */}
                    <div className="lg:hidden inline-block w-full">
                        <button
                            className="rounded-full my-4 px-8 py-5 w-full uppercase bg-purple text-white transition-all hover:opacity-75"
                            onClick={(e)=>{ toggleFiltersOpen(true); e.preventDefault() }}>Open Filters</button>
                        <a href="#"
                            className="py-2 text-bluegreen mt-2 mb-4 text-right text-lg font-semibold"
                            onClick={(e) =>{ reset(); e.preventDefault() }}
                            style={{display: !haveFilters ? 'none' : 'block'}}>
                              <svg viewBox="185.411 115.41 11 11" width="11" height="11" className='my-1.5 mx-3 inline-block'>
                                  <path
                                      d="M 195.198 115.41 L 190.911 119.695 L 186.624 115.41 L 185.411 116.623 L 189.696 120.91 L 185.411 125.197 L 186.624 126.41 L 190.911 122.125 L 195.198 126.41 L 196.411 125.197 L 192.126 120.91 L 196.411 116.623 Z"
                                      className="fill-bluegreen"></path>
                              </svg>
                              Clear Filters</a>
                    </div>
                    <span className="my-8 xl:my-4 uppercase w-full block text-right text-lg xl:text-sm font-semibold">{showing}</span>

                    <div className={this.mode === 'media' ? 'lg:ml-5 grid xl:grid-cols-3 xl:gap-3 lg:grid-cols-2 lg:gap-2' : ''}>{
                        count === 0 ?
                        <p className='w-full text-xl my-20 text-center'>Sorry, no matches found. Please try other filters.</p> :
                                <AnimatePresence>
                                    {filteredItems.map((item: MediaItem & StudioItem, i: number) => (
                                        <this.ItemRenderer key={i} item={item} />
                                    ))}
                                </AnimatePresence>
                        }
                    </div>
                </div>
            </div>
    };

};
