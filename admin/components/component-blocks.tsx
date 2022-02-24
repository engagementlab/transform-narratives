import React from 'react';
import { NotEditable, component, fields } from '@keystone-6/fields-document/component-blocks';
import {
  ToolbarButton,
  ToolbarGroup,
  ToolbarSeparator,
} from '@keystone-6/fields-document/primitives';
import Image from 'next/image';

// naming the export componentBlocks is important because the Admin UI
// expects to find the components like on the componentBlocks export
export const componentBlocks = {
  image: component({
     component: (props) => {
        //hacky way to get the gql query for the cloudinary image data
       const data = (props.image && props.image.value) ? props.image.value.data : null;

      return !data ||
       (
         <>
           <ToolbarGroup />
           <div style={{ display: 'flex', flexDirection: 'column' }}>
                 <img
                   style={{width:'100%'}}
                   key={0}
                   className="body-image"
                   src={data.image?.publicUrlTransformed}
                   alt="test"
                 />

           </div>
         </>
       );
     },
     label: 'Image',
     props: {
       image: fields.relationship<'many'>({
         label: 'Images',
         relationship: 'image',
       }),
     },
   }),
 }