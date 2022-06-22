import { DocumentRendererProps } from '@keystone-6/document-renderer';
import { ReactNode } from 'react';

import FlexLayout from './FlexLayout';
import HeadingStyle from './HeadingStyle';

const DocRenderers = (renderOverrides?: { heading?: Function; layout?: Function; link?: Function; bold?: Function; }): DocumentRendererProps['renderers'] => {
let blocks: DocumentRendererProps['renderers'] = {
    inline: {
        bold: ({children}) => {
            return renderOverrides?.bold ? renderOverrides.bold(children) : <strong>{children}</strong>;
        },
        link: ({ children, href }) => {
            const label = (children as any).at(0).props.node.text;
            return renderOverrides?.link ? renderOverrides.link(children, href) : <a href={href} target="_blank" className='text-purple no-underline border-b-2 border-b-[rgba(141,51,210,0)] hover:border-b-[rgba(141,51,210,1)] transition-all'>{label}</a>;
        }
    }, 
    block: {
        heading: ({ level, children, textAlign }) => {
            return renderOverrides?.heading ? renderOverrides.heading(level, children, textAlign) : HeadingStyle(level, children, textAlign);
        },
        layout: ({layout, children}) => {
            return  renderOverrides?.layout ? renderOverrides.layout(layout, children) : FlexLayout(layout, children);
        }
    },
  }
  return blocks;
};

export default DocRenderers;
