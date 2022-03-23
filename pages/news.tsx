import {
    InferGetStaticPropsType
} from "next";
import Link from "next/link";

import {
    query
} from '.keystone/api';
import Image from "../components/Image";

type News = {
    name: string;
    key: string;
    publicDate: string;
    body: any;
    thumbnail: {
        publicId: string;
    }
}

type ItemProps = {
    event: News;
    index: number;
    past: boolean;
}

export default function News({ items }: InferGetStaticPropsType<typeof getStaticProps>) {
    return (
        <div className="container mx-auto mt-14 mb-14 xl:mt-16 px-4 xl:px-8">
            <h2 className="text-2xl text-bluegreen font-semibold">Upcoming Newss</h2>
            <div className='flex flex-col mt-6'>
                {upcoming.map((event, i) => (
                     <div className="w-full flex flex-col-reverse md:flex-row" key={`${props.past ? '' : 'upcoming'}-${props.index}`}>
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
                             <a>
                                 <h4 className="text-bluegreen text-xl font-semibold my-2">{props.event.name}</h4>
                             </a>
                         </Link>
                         <Image id={`thumb-${props.index}-${props.past ? '' : 'upcoming'}`} alt={`Thumbnail for event with name "${props.event.name}" `}
                             imgId={props.event.thumbnail.publicId} width={335} />
                     </div>
                 </div>
                ))}
            </div>
        </div>
    );
}

export async function getStaticProps() {
    const items = await query.NewsItem.findMany({ query: 'name key publishDate thumbnail { publicId }'  }) as News[];

    return {
      props: {
        items
      }
    };
  }