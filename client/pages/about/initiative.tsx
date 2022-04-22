import { InferGetStaticPropsType } from 'next';
import { query } from '.keystone/api';
import { DocumentRenderer, DocumentRendererProps } from '@keystone-6/document-renderer';
import BlockRenderers from '../../components/BlockRenderers';
import Layout from '../../components/Layout';
import FlexLayout from '../../components/FlexLayout';
import Image from '../../components/Image';

type AboutPage = {
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
const renderers: DocumentRendererProps['renderers'] = {
  // use your editor's autocomplete to see what other renderers you can override
  inline: {
    bold: ({ children }) => {
      return <strong>{children}</strong>;
    }
  },
  block: {
    heading: ({ level, children, textAlign }) => {
      return <p className={`${level === 3 && 'text-2xl text-bluegreen leading-none'} ${level === 4 && 'text-xl text-coated'} font-semibold mb-8`} style={{ textAlign }}>{children}</p>;
    },
    layout: ({layout, children}) => {
        return FlexLayout(layout, children);
    }
  }
};

export default function AboutInitiative({ page }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout>
      <div className='about-container container mt-14 mb-24 xl:mt-16 px-4 xl:px-8 w-full lg:w-10/12 xl:w-9/12'>
        <DocumentRenderer document={page.content.document} renderers={renderers} componentBlocks={BlockRenderers(image)} />
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const page = await query.About.findOne({
    where: { name: 'About Page' },
    query: `content { document(hydrateRelationships: true) }`
  }) as AboutPage;
  // console.log(page.content.document[5].children[0].children[0])
  return {
    props: {
      page
    }
  };
}
