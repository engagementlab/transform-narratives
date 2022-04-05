import React from "react";
import create, { Mutate, GetState, SetState, StoreApi, UseBoundStore, State } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import _ from 'lodash';
import { AnimatePresence } from "framer-motion"

export type MediaItem = {
    title?: string;
    name?: string;
    key: string;
    shortDescription?: string;
    blurb?: string;
    filters: string;
    thumbnail: {
        publicId: string;
    }
}
type ItemRendererProps = {
    item: MediaItem;
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
  
export class Filtering {

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
                                        <span className="ml-2">    
                                            {key}
                                        </span> 
                                    </div>
                                </a>
                                <ul className={`relative overflow-hidden transition-all ${haveGroupClosed(key) ? 'max-h-0' : 'max-h-96'}`}>
                                    {filters[key].map(filter => {
                                        return (
                                            <li key={filter.key} className={`mt-4 text-lg xl:text-sm font-semibold
                                                ${!haveSpecificFilter(filter.key) ? 'text-bluegreen' : 'text-purple' }`}>
                                                <a href="#" onClick={(e)=>{ toggleFilter(filter.key); e.preventDefault() }}
                                                    className='w-3/4 flex items-center justify-between'>
                                                    {filter.name}
                                                    <svg viewBox="185.411 115.41 11 11" width="11" height="11"
                                                        className='flex-shrink-0'
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
                    <div className="mr-2 flex justify-between">
                        <span>Filters</span>
                        <a href="#" className="text-bluegreen" onClick={(e) =>{ reset(); e.preventDefault() }}  style={{visibility: !haveFilters ? 'hidden' : 'visible'}}>Clear</a> 
                    </div>
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
                        className="my-4 w-full rounded-full px-6 py-2 uppercase bg-purple text-white transition-all hover:opacity-75"
                        onClick={(e)=>{ toggleFiltersOpen(false) }}>Apply</button>
                </div>
            </div>);

    };
    
    FilteredItems = () => {
        
            let selectedFilters = this.useStore(state => state.currentFilters);
            // console.log(preSelectedFilters, selectedFilters)
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
                <div className='w-0 lg:w-2/5 xl:w-1/5 flex-shrink-0 xl:border-r border-[#B9CCC7]'>
                    {this.RenderFilters(this.filtersGrouped)}
                </div>

                <div className="w-full">
                    {/* Mobile Filters/Clear button */}
                    <div className="lg:hidden inline-block w-full">
                        <button
                            className="rounded-full my-4 px-6 py-2 w-full uppercase bg-purple text-white transition-all hover:opacity-75"
                            onClick={(e)=>{ toggleFiltersOpen(true); e.preventDefault() }}>Filters</button>
                        <button
                            className="rounded-full my-2 px-6 py-2 w-full uppercase bg-purple text-white transition-all hover:opacity-75"
                            onClick={(e)=>{ reset(); e.preventDefault() }}
                            style={{display: !haveFilters ? 'none' : 'block'}}>Clear</button>
                    </div>
                    <span className="my-4 uppercase w-full block lg:text-right">{showing}</span>
                        
                    <div className={this.mode === 'media' ? 'xl:flex xl:ml-5' : ''}>{
                        count === 0 ?
                        <p className='w-full text-4xl text-center'>No matches! Please try other filters.</p> :
                                <AnimatePresence>
                                    {filteredItems.map((item: MediaItem, i: number) => (
                                        <this.ItemRenderer key={i} item={item} />
                                    ))}
                                </AnimatePresence>
                        }
                    </div>
                </div>
            </div>
    };

};
