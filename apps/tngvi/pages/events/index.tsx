import {
    InferGetStaticPropsType
} from "next";
import React, { useEffect } from 'react'
import Link from "next/link";
import _ from 'lodash';

import query from "../../apollo-client";

import { Image } from '@el-next/components/image';
import Layout from "../../components/Layout";
import ImagePlaceholder from "../../components/ImagePlaceholder";

type Event = {
    name: string;
    key: string;
    eventDate: string;
    blurb: string;
    registrationLink?: string;
    address?: string;
    content?: any;
    thumbnail: {
        publicId: string;
    }
}

type ItemProps = {
    event: Event;
    index: number;
    past: boolean;
}

const Item = (props: ItemProps) => {

    return (
        <div className="w-full flex flex-col-reverse md:flex-row mb-20" key={`${props.past ? '' : 'upcoming'}-${props.index}`}>
            <div className="w-full md:w-1/3">
                <div className="text-coated text-xl font-semibold leading-8 mt-3 md:mt-0">
                    {new Date(props.event.eventDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                    })}
                    <br />
                    {new Date(props.event.eventDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                    })}
                    <br />
                    {new Date(props.event.eventDate).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </div>

                {!props.past &&
                    <div>
                        {props.event.address && <div className="my-4 mt-8 font-medium">{props.event.address}</div>}
                        <a href={props.event.registrationLink}>
                            <button 
                            className='inline-block rounded-full px-8 py-6 uppercase bg-lynx text-bluegreen border-2 border-bluegreen transition-all hover:bg-bluegreen hover:text-lynx'>
                                Register Now
                            </button>
                        </a>
                    </div>
                }
            </div>
            <div className="flex-grow">
                <Link href={`/events/${props.event.key}`} passHref>
                    <div className="cursor-pointer">
                        <a className='group'>
                            <h3 className="text-bluegreen hover:text-green-blue group-hover:text-green-blue text-xl font-semibold my-2">{props.event.name}</h3>
                            {
                                props.event.thumbnail ?
                                <Image id={`thumb-${props.index}-${props.past ? '' : 'upcoming'}`} alt={`Thumbnail for event with name "${props.event.name}" `}
                                imgId={props.event.thumbnail.publicId} width={335} /> :
                                <ImagePlaceholder imageLabel='Thumbnail' width={335} height={335} />
                            }
                        </a>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default function Events({ events }: InferGetStaticPropsType<typeof getStaticProps>) {

    const today = new Date();
    const upcoming = events.filter(e => {return new Date(e.eventDate) > today});
    const past = events.filter(e => {return new Date(e.eventDate) < today});

    return (
        <Layout>
            <div className="container mt-14 mb-24 xl:mt-16 px-4 xl:px-8">
                <h2 className="text-2xl text-bluegreen font-semibold mb-8">Upcoming Events</h2>
                <div className='flex flex-col mt-6'>
                    {
                        upcoming.length === 0 ?
                        <h3 className=''>No upcoming events currently. Please check back soon.</h3> :
                        upcoming.map((event, i) => ( <Item key={i} event={event} index={i} past={false} /> ))
                    }
                </div>

                <h2 className="text-2xl text-bluegreen font-semibold mt-20">Past Events</h2>
                <div className='flex flex-col mt-6'>
                    {past.map((event, i) => (
                        <Item key={i} event={event} index={i} past={true} />
                    ))}
                </div>
            </div>
        </Layout>
    );
}

export async function getStaticProps() {
    const evtQuery = 'name key eventDate registrationLink address blurb thumbnail { publicId }';
    const events = await query(
        'events', 
        `events(
            where: {
                enabled: {
                    equals: true
                }
            },
            orderBy: {
                eventDate: desc
            }) {
                ${evtQuery}
            }`) as Event[];

    return {
      props: {
        events
      }
    };
  }
