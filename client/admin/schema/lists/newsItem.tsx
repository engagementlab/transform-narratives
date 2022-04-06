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
import { CreateKey } from '../hooks';

const NewsItem: Lists.NewsItem = list({
    fields: {
      title: text({
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
          folder: 'tngvi/news',
        },
      }),
      thumbAltText: text({
        validation: {
          isRequired: true
        },
        label: 'Describe appearance of Thumbnail/Header Image'
      }),
      publishDate: timestamp({
          validation:{
              isRequired: true,
          }
      }),
      blurb: text({
        label: 'Blurb (appears on News index page)',
        validation: {
          isRequired: true
        },
        ui: {
          displayMode: 'textarea'
        }
      }),
      body: document({
          formatting: {
              headingLevels: [3, 4],
              inlineMarks: true,
              listTypes: true,
              alignment: true,
              blockTypes: true,
              softBreaks: true,
          },
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
              listKey: 'NewsImage',
              selection: 'imageName altText caption image {publicUrlTransformed publicId}',
            },
          },
      }),
      images: relationship({
        ref: 'NewsImage.newsImages',
        many: true,
        label: "Images (add here for use in 'Body' field)",
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
        if(resolvedData.title) {
  
          resolvedData = {
            ...resolvedData,
            key: CreateKey(resolvedData.title)
          }
  
        }
        return resolvedData;
      }
    }
  });
  export default NewsItem;