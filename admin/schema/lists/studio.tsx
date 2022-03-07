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
import {
  componentBlocks
} from '../../components/component-blocks';

const Studio: Lists.Studio = list({
  fields: {
    name: text({
      validation: {
        isRequired: true
      }
    }),
    slug: text({
      isIndexed: 'unique',
      isFilterable: true,
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
          listKey: 'StudioImage',
          selection: 'imageName altText image {publicUrlTransformed publicId}',
        },
      },
    }),
    photos: relationship({
      ref: 'StudioImage.studioImages',
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
        createView: {
          fieldMode: 'edit'
        },
        listView: {
          fieldMode: 'hidden'
        },
        itemView: {
          fieldMode: 'edit'
        },
      },
    }),
    // video: video(),
    // file: azureStorageFile({ azureStorageConfig: azConfig }),
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
      let updatedData = resolvedData;
      updatedData.slug = resolvedData['name'].toLocaleLowerCase().replaceAll(/\s/ig, '-');
      return updatedData;
    }
  }
});
export default Studio;