import {
    InferGetStaticPropsType
} from "next";
import Link from "next/link";

import {
    query
} from '.keystone/api';
import Image from "../../components/Image";
import Layout from "../../components/Layout";
import ImagePlaceholder from "../../components/ImagePlaceholder";

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
            <div className="container mt-14 mb-24 xl:mt-16 px-4 xl:px-8">
                <h2 className="text-2xl text-bluegreen font-semibold mb-8">Latest News</h2>
                <div className='mt-6'>
                    {items.map((item, i) => (
                        <div className={`flex flex-col-reverse md:flex-row ${i > 0 && 'mt-14'}`} key={i}>
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
                                    {new Date(item.publishDate).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                    })}
                                </div>
                            </div>
                            <div className="flex-shrink">
                                <Link href={`/news/${item.key}`} passHref>
                                    <a className='group'>

                                <h3 className="text-bluegreen hover:text-green-blue group-hover:text-green-blue text-xl font-semibold my-2">
                                    {item.title}
                                </h3>
                                <p className='max-w-2xl'>{item.blurb}</p>
                                {
                                    item.thumbnail ?
                                    <Image id={`thumb-${i}`} alt={`Thumbnail for blog post with title "${item.title}" `}
                                    imgId={item.thumbnail.publicId} width={335} /> :
                                    <ImagePlaceholder imageLabel='News' width={335} height={200} />
                                }
                                </a>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}

export async function getStaticProps() {
    const items = await query.NewsItem.findMany({ query: 'title key publishDate blurb thumbnail { publicId }', orderBy: {publishDate: 'desc'}, where: { enabled: { equals: true }  }}) as News[];

    return {
      props: {
        items
      }
    };
  }
