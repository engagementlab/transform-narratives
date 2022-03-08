import {
    list
  } from '@keystone-6/core';
import {
    json,
    relationship,
    text
} from '@keystone-6/core/fields';
import {
    document
} from '@keystone-6/fields-document';
import {
    Lists
} from '.keystone/types';
import path from 'path';
import { componentBlocks } from '../../components/component-blocks';
import { azConfig, azureStorageFile } from '../azure';

const MediaItem: Lists.MediaItem = list({
    fields: {
      title: text({
        validation: {
          isRequired: true
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
            listKey: 'MediaImage',
            selection: 'imageName altText image {publicUrlTransformed publicId}',
          },
        },
      }),
      images: relationship({
        ref: 'MediaImage.mediaImages',
        many: true,
        label: "Images (add here for use in 'Content' field)",
        ui: {
          displayMode: 'cards',
          cardFields: ['image', 'imageName', 'altText'],
          inlineCreate: {
            fields: ['image', 'imageName', 'altText']
          },
          inlineEdit: {
            fields: ['image', 'imageName', 'altText']
          },
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
      file: azureStorageFile({ azureStorageConfig: azConfig, label: 'PDF' }),
    }
  });
  export default MediaItem;