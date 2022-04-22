import { DocumentRendererProps } from '@keystone-6/document-renderer';

import FlexLayout from './FlexLayout';
import HeadingStyle from './HeadingStyle';

const DocumentProps = (linkOverride?: any): DocumentRendererProps['renderers'] => {
  let blocks: DocumentRendererProps['renderers'] = {
    inline: {
        // link: ({ children, href }) => {
        //     const label = (children as any).at(0).props.node.text;
        //     return linkOverride ? linkOverride : <a href={href} className='text-purple no-underline border-b-2 border-b-[rgba(141,51,210,0)] hover:border-b-[rgba(141,51,210,1)] transition-all'>{label}</a>;
        // }
    }, 
    block: {
        heading: ({ level, children, textAlign }) => {
            return HeadingStyle(level, children, textAlign);
        },
        layout: ({layout, children}) => {
            return FlexLayout(layout, children);
        }
    },
  }
  return blocks;
};

export default DocumentProps;
