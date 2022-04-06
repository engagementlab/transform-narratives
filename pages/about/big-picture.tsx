import { InferGetStaticPropsType } from 'next';
import { query } from '.keystone/api';
import { DocumentRenderer, DocumentRendererProps } from '@keystone-6/document-renderer';
import BlockRenderers from '../../components/BlockRenderers';
import Layout from '../../components/Layout';
import HeadingStyle from '../../components/HeadingStyle';
import FlexLayout from '../../components/FlexLayout';

type BigPicturePage = {
  content: any;
}; 

const renderers: DocumentRendererProps['renderers'] = {
  // use your editor's autocomplete to see what other renderers you can override
  inline: {
    bold: ({ children }) => {
      return <strong>{children}</strong>;
    },
  },
  block: {
    heading: ({ level, children, textAlign }) => {
      const customRenderers = {
        3: 'text-2xl font-extrabold text-bluegreen'
      };
      return HeadingStyle(level, children, textAlign, customRenderers);
    },
    layout: ({layout, children}) => {
        return FlexLayout(layout, children);
    }
  },
};

export default function BigPicture({ page }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout>
      <div className='container mt-14 mb-14 xl:mt-16 px-4 xl:px-8 w-full lg:w-7/12'>
        <DocumentRenderer document={page.content.document} renderers={renderers} componentBlocks={BlockRenderers} />
      </div>
    </Layout>
  );
}
export async function getStaticProps() {
  const page = await query.BigPicture.findOne({
    where: { name: 'Big Picture Page' },
    query: `content { document } `
  }) as BigPicturePage;

  return {
    props: {
      page
    }
  };
}