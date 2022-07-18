import {
    InferGetStaticPropsType
} from "next";
import Link from "next/link";

import query from "../../apollo-client";
import { Image } from '@el-next/components/image';
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
    externalLink?: string;
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
                                {item.externalLink
                                ?
                                <a className='group' href={item.externalLink}>

                                    <h3
                                        className="text-bluegreen hover:text-green-blue group-hover:text-green-blue text-xl font-semibold my-2">
                                        {item.title}
                                        <svg viewBox="0 0 15 15" width="15" height="15" className="inline ml-1">
                                            <g transform="matrix(0.042265, 0, 0, 0.042265, 0, 2)">
                                                <g>
                                                    <path
                                                        d="M266.422,0h-97.625c-9.65,0-17.5,7.851-17.5,17.5c0,9.649,7.85,17.5,17.5,17.5h55.377l-92.375,92.374   c-3.307,3.305-5.127,7.699-5.127,12.375c0,4.676,1.819,9.069,5.125,12.371c3.306,3.309,7.699,5.13,12.375,5.13   c4.674,0,9.069-1.82,12.376-5.127l92.374-92.375v55.377c0,9.649,7.851,17.5,17.5,17.5c9.649,0,17.5-7.851,17.5-17.5V17.5   C283.922,7.851,276.071,0,266.422,0z"
                                                        className=' fill-bluegreen transition-all group-hover:translate-x-5 group-hover:-translate-y-5 group-hover:fill-green-blue'>
                                                    </path>
                                                    <path
                                                        d="M201.137,253.922H30V82.785h128.711l30-30H15c-8.284,0-15,6.716-15,15v201.137c0,8.284,6.716,15,15,15h201.137   c8.284,0,15-6.716,15-15V95.211l-30,30V253.922z"
                                                        className=' fill-bluegreen transition-all group-hover:fill-green-blue'>
                                                    </path>

                                                </g>
                                            </g>
                                        </svg>
                                    </h3>
                                    <p className='max-w-2xl'>{item.blurb}</p>
                                    {
                                    item.thumbnail ?
                                    <Image id={`thumb-${i}`} alt={`Thumbnail for blog post with title "${item.title}" `}
                                        imgId={item.thumbnail.publicId} width={335} /> :
                                    <ImagePlaceholder imageLabel='News' width={335} height={200} />
                                    }
                                </a>
                                :
                                <Link href={`/news/${item.key}`} passHref>
                                    <a className='group'>

                                        <h3
                                            className="text-bluegreen hover:text-green-blue group-hover:text-green-blue text-xl font-semibold my-2">
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
    const items = await query(
        'newsItems',
        `newsItems(
            where: {
                enabled: {
                    equals: true
                }
            },
            orderBy: {
                publishDate: desc
            }		
        ) { 
            title
            key
            publishDate
            externalLink
            blurb
            thumbnail { 
                publicId
            }
        }`) as News[];
    return {
        props: {
            items
        }
    };
}
