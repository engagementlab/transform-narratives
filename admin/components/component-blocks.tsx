/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { NotEditable, component, fields } from '@keystone-6/fields-document/component-blocks';
import { HydratedRelationshipData } from '@keystone-6/fields-document/dist/declarations/src/DocumentEditor/component-blocks/api';

// naming the export componentBlocks is important because the Admin UI
// expects to find the components like on the componentBlocks export
export const componentBlocks = {
  image: component({
     component: (props) => {
      if(!props.image.value) return null;

      const data = (props.image.value as unknown as HydratedRelationshipData).data;
      return (
          <img
            style={{width:'100%'}}
            className="body-image"
            src={data.image?.publicUrlTransformed}
            alt="Document image"
          />
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