import { DocumentRendererProps } from '@keystone-6/document-renderer';

import FlexLayout from './FlexLayout';
import HeadingStyle from './HeadingStyle';

const DocRenderers = (renderOverrides?: { heading: any; layout?: ({ layout, children }: { layout: any; children: any; }) => JSX.Element; link?: any; }): DocumentRendererProps['renderers'] => {
  let blocks: DocumentRendererProps['renderers'] = {
    inline: {
        link: ({ children, href }) => {
            const label = (children as any).at(0).props.node.text;
            return renderOverrides?.link ? renderOverrides.link(children, href) : <a href={href} className='text-purple no-underline border-b-2 border-b-[rgba(141,51,210,0)] hover:border-b-[rgba(141,51,210,1)] transition-all'>{label}</a>;
        }
    }, 
    block: {
        heading: ({ level, children, textAlign }) => {
            return renderOverrides?.heading ? renderOverrides.heading(level, children, textAlign) : HeadingStyle(level, children, textAlign);
        },
        layout: ({layout, children}) => {
            return FlexLayout(layout, children);
        }
    },
  }
  return blocks;
};

export default DocRenderers;
