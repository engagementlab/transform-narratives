import { ReactNode } from 'react';
import { InferGetStaticPropsType } from 'next';
import { query } from '.keystone/api';
import { DocumentRenderer, } from '@keystone-6/document-renderer';

import BlockRenderers from '../../components/BlockRenderers';
import Layout from '../../components/Layout';
import HeadingStyle from '../../components/HeadingStyle';
import Image from '../../components/Image';
import DocRenderers from '../../components/DocRenderers';

type BigPicturePage = {
  content: any;
};

const image = (props: any) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Image id={'img-' + props.image.data.image.publicId} alt={props.image.data.altText} imgId={props.image.data.image.publicId} aspectDefault={true} />
      <p>{props.image.data.caption}</p>
    </div>
  );
};

const rendererOverrides = {
    heading: (level: number, children: ReactNode, textAlign: any) => {
      const customRenderers = {
        3: 'text-2xl font-semibold text-bluegreen'
      };
      return HeadingStyle(level, children, textAlign, customRenderers);
    },
    layout: (layout: any, children: any) => {
        const flexClass = 'flex gap-x-5 flex-col md:flex-row justify-between';
        if(layout[0] === 2 && layout[1] === 1) {
            return (
                <div
                    className={flexClass}
                >
                {children.map((element: any, i: number) => (
                    <div key={i} className={`${i === 0 ? 'w-full lg:w-3/4' : ''}`}>{element}</div>
                ))}
                </div>
            );
        }
        else if(layout[0] === 1 && layout[1] === 1 && layout[2] === 1) {
            return (
                <div
                    className={flexClass}
                >
                {children.map((element: any, i: number) => (
                    <div key={i} className='w-full lg:w-1/3'>{element}</div>
                ))}
                </div>
            );
        }
        else return <div>{children}</div>;
      }
};

export default function BigPicture({ page }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout>
      <div className='about-container container mt-14 mb-24 xl:mt-16 px-4 xl:px-8 w-full lg:w-10/12 xl:w-9/12'>
         <DocumentRenderer document={page.content.document} componentBlocks={BlockRenderers(image)} renderers={DocRenderers(rendererOverrides)} />
      </div>
    </Layout>
  );
}
export async function getStaticProps() {
  const page = await query.BigPicture.findOne({
    where: { name: 'Big Picture Page' },
    query: `content { document(hydrateRelationships: true) } `
  }) as BigPicturePage;

  return {
    props: {
      page
    }
  };
}
