import { InferGetStaticPropsType } from 'next';
import { query } from '.keystone/api';
import { DocumentRenderer } from '@keystone-6/document-renderer';
import BlockRenderers from '../../components/BlockRenderers';
import Layout from '../../components/Layout';
import Image from '../../components/Image';
import DocRenderers from '../../components/DocRenderers';
import { ReactNode } from 'react';

type AboutPage = {
  content: any;
};

const cdnImage = (props: any) => {
  console.log(props)
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Image id={'img-' + props.image.publicId} alt={props.image.data.alt} imgId={props.image.publicId} aspectDefault={true} />
      <p>{props.image.data.caption}</p>
    </div>
  );
};
const rendererOverrides = {
  heading: (level: number, children: ReactNode, textAlign: any) => {
    return <p className={`${level === 3 && 'text-2xl text-bluegreen leading-none'} ${level === 4 && 'text-xl text-coated'} font-semibold mb-8`} style={{ textAlign }}>{children}</p>;
  }
};

export default function AboutInitiative({ page }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout>
      <div className='about-container container mt-14 mb-24 xl:mt-16 px-4 xl:px-8 w-full lg:w-10/12 xl:w-9/12'>
        <DocumentRenderer document={page.content.document} renderers={DocRenderers(rendererOverrides)} componentBlocks={BlockRenderers(cdnImage)} />
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const page = await query.About.findOne({
    where: { name: 'About Page' },
    query: `content { document(hydrateRelationships: true) }`
  }) as AboutPage;
  console.log(page.content.document[1])
  return {
    props: {
      page
    }
  };
}
