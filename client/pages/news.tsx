import {
    InferGetStaticPropsType
} from "next";
import Link from "next/link";

import {
    query
} from '.keystone/api';
import Image from "../components/Image";
import Layout from "../components/Layout";
import ImagePlaceholder from "../components/ImagePlaceholder";

type News = {
    title: string;
    key: string;
    publishDate: string;
    blurb: string;
    body: any;
    thumbnail: {
        publicId: string;
    }
}

export default function News({ items }: InferGetStaticPropsType<typeof getStaticProps>) {
    return (
        <Layout>
            <div className="container mt-14 mb-14 xl:mt-16 px-4 xl:px-8">
                <h2 className="text-2xl text-bluegreen font-semibold">Latest News</h2>
                <div className='flex flex-col mt-6'>
                    {items.map((item, i) => (
                        <div className="w-full flex flex-col-reverse md:flex-row" key={i}>
                        <div className="w-full md:w-1/3">
                            <div className="text-coated text-xl font-semibold leading-8 mt-3 md:mt-0">
                                {new Date(item.publishDate).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    })}
                                <br />
                                {new Date(item.publishDate).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    })}
                                <br />
                                {new Date(item.publishDate).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    })}
                            </div>
                        </div>
                        <div className="flex-grow">
                            <Link href={`/news/${item.key}`} passHref>
                                <a>
                                    <h4 className="text-bluegreen text-xl font-semibold my-2">{item.title}</h4>
                                </a>
                            </Link>
                            <p>{item.blurb}</p>
                 
                            {
                                item.thumbnail ?
                                <Image id={`thumb-${i}`} alt={`Thumbnail for blog post with title "${item.title}" `}
                                imgId={item.thumbnail.publicId} width={335} /> :
                                <ImagePlaceholder imageLabel='News' width={335} height={200} />
                            }
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}

export async function getStaticProps() {
    const items = await query.NewsItem.findMany({ query: 'title key publishDate blurb thumbnail { publicId }'  }) as News[];

    return {
      props: {
        items
      }
    };
  }