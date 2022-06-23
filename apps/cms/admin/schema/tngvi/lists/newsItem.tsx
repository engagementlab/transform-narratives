import {
    list
  } from '@keystone-6/core';
import {
  checkbox,
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
import { componentBlocks } from '../../../components/component-blocks';
import { cloudinaryImage } from '../../../components/cloudinary';
import { CreatedTimestamp, CreateKey } from '../../hooks';

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
      createdDate: CreatedTimestamp,
      enabled: checkbox({
        defaultValue: true,
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
      externalLink: text({
        validation: {
          match: { 
            regex: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm,
            explanation: 'Not a valid URL'
          }
        },
        label: 'External link'
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
    },
    ui: {
      description: 'If external link is used, body is not required.',
      listView: { 
        initialColumns: ['title', 'publishDate', 'thumbnail'],
        initialSort: { field: 'publishDate', direction: 'DESC' },
      }
    },
  });
  export default NewsItem;