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
   button: component({
      component: ({label, link}) => {
        return (      
         <div
           style={{ backgroundColor: 'rgb(247 247 247)', display: 'inline-block', borderRadius: '38px', padding: '1rem'}}
           className='inline-block rounded-full px-8 py-5 uppercase bg-lynx text-bluegreen border-2 border-bluegreen'>
           <div style={{ fontWeight: 'bold', color: '#718096' }}>{label}</div>
           <div style={{ fontStyle: 'italic', color: '#4A5568' }}>
             <NotEditable><svg viewBox="70.001 0.006 10 10" width="10" height="10">
                 <g transform="matrix(0.017858, 0, 0, 0.017858, 68.750916, 0.006137)">
                   <path
                     d="m586.27 43.738c-58.324-58.309-152.88-58.309-211.19 0l-83.328 83.293c6.5977-0.71875 13.262-1.0273 19.961-1.0273 21.086 0 41.594 3.3516 61.008 9.8086l47.219-47.199c16.219-16.234 37.785-25.156 60.719-25.156 22.938 0 44.504 8.9219 60.719 25.156 16.219 16.199 25.137 37.734 25.137 60.699 0 22.934-8.918 44.5-25.137 60.699l-92.383 92.383c-16.219 16.242-37.785 25.16-60.719 25.16-22.969 0-44.5-8.918-60.734-25.152-7.8945-7.8633-14.047-17.023-18.285-27.004-10.527 0.58203-20.371 4.957-27.891 12.473l-24.609 24.641c6.7344 12.473 15.379 24.23 25.906 34.797 58.309 58.312 152.88 58.312 211.2 0l92.398-92.418c58.293-58.305 58.293-152.84 0.003907-211.15z">
                   </path>
                   <path
                     d="m389.27 433.96c-21.121 0-41.832-3.418-61.691-10.152l-47.543 47.543c-16.199 16.234-37.766 25.156-60.699 25.156-22.934 0-44.465-8.918-60.699-25.156-16.234-16.203-25.156-37.766-25.156-60.699 0-22.934 8.9219-44.504 25.156-60.734l92.383-92.383c16.234-16.199 37.766-25.121 60.699-25.121 22.969 0 44.5 8.9219 60.715 25.121 7.8984 7.8945 14.062 17.055 18.32 27.035 10.562-0.54688 20.422-4.957 27.941-12.473l24.574-24.609c-6.7344-12.512-15.398-24.266-25.941-34.828-58.309-58.309-152.88-58.309-211.19 0l-92.383 92.418c-58.34 58.312-58.34 152.84 0 211.19 58.309 58.312 152.84 58.312 211.15 0l83.188-83.191c-6.2031 0.57813-12.473 0.89063-18.797 0.89063z">
                   </path>
                 </g>
               </svg></NotEditable>{link}
           </div>
         </div>
        );
      },
      label: 'Button',
      props: {
        label: fields.child({
          kind: 'block',
          placeholder: 'Label',
          formatting: { inlineMarks: 'inherit', softBreaks: 'inherit' },
          links: 'inherit',
        }),
        link: fields.child({ kind: 'inline', placeholder: '/link/here' }),
      },
      chromeless: true
    }),
 }