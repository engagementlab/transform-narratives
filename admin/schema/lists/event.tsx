import {
    list
  } from '@keystone-6/core';
import {
    json,
    relationship,
    text,
    timestamp
} from '@keystone-6/core/fields';
import {
    document
} from '@keystone-6/fields-document';
import {
    Lists
} from '.keystone/types';
import path from 'path';
import { componentBlocks } from '../../components/component-blocks';
import { cloudinaryImage } from '../../components/cloudinary';

const Event: Lists.Event = list({
    fields: {
      name: text({
        validation: {
          isRequired: true
        }
      }),
      key: text({
        isIndexed: 'unique',
        isFilterable: true,
        ui: {
          createView: {
            fieldMode:'hidden'
          },
          itemView: {
            fieldMode: 'hidden'
          }
        }
      }),
      thumbnail: cloudinaryImage({
        label: 'Thumbnail/Header Image',
        cloudinary: {
          cloudName: `${process.env.CLOUDINARY_CLOUD_NAME}`,
          apiKey: `${process.env.CLOUDINARY_KEY}`,
          apiSecret: `${process.env.CLOUDINARY_SECRET}`,
          folder: 'tngvi/events',
        },
      }),
      eventDate: timestamp({
          validation:{
              isRequired: true,
          }
      }),
      blurb: text({
        validation: {
          isRequired: true
        },
        ui: {
          displayMode: 'textarea'
        }
      }),
      content: document({
        formatting: true,
        dividers: true,
        links: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
        ui: {
          views: path.join(process.cwd(), 'admin/components/component-blocks')
        },
  
        componentBlocks,
  
        relationships: {
          image: {
            kind: 'prop',
            listKey: 'EventImage',
            selection: 'imageName altText image {publicUrlTransformed publicId}',
          },
        },
      }),
      speakersBios: document({
        formatting: {
            inlineMarks: true,
        },
        links: true,
        layouts: [
            [1, 2],
        ],
        ui: {
            views: path.join(process.cwd(), 'admin/components/component-blocks')
        },
        componentBlocks,
      }),
      images: relationship({
        ref: 'EventImage.eventImages',
        many: true,
        label: "Document Images (add here for use in 'Content/Bios' fields)",
        ui: {
          displayMode: 'cards',
          cardFields: ['image', 'imageName', 'altText', 'caption'],
          inlineCreate: {
            fields: ['image', 'imageName', 'altText', 'caption']
          },
          inlineEdit: {
            fields: ['image', 'imageName', 'altText', 'caption']
          },
        },
      }),
         
      mainVideo: json({
        ui: {
          views: path.join(process.cwd(), '/admin/components/video/components.tsx'),
          createView: { fieldMode: 'edit' },
          listView: { fieldMode: 'hidden' },
          itemView: { fieldMode: 'edit' },
        },
      }),
      videos: json({
        ui: {
          views: path.join(process.cwd(), '/admin/components/video/components.tsx'),
          createView: { fieldMode: 'edit' },
          listView: { fieldMode: 'hidden' },
          itemView: { fieldMode: 'edit' },
        },
      }),
    },
    hooks: {
      resolveInput: async ({
        listKey,
        operation,
        inputData,
        item,
        resolvedData,
        context,
      }) => {
        if(resolvedData.name) {
  
          resolvedData = {
            ...resolvedData,
            key: resolvedData.name.toLocaleLowerCase().replaceAll(/\s/ig, '-')
          }
  
        }
        return resolvedData;
      }
    }
  });
  export default Event;