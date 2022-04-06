import {
    list
} from '@keystone-6/core';
import {
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

const BigPicture: Lists.BigPicture = list({
    fields: {
        name: text({
            isIndexed: 'unique',
            isFilterable: true,
            defaultValue: 'Big Picture Page',
            ui: {
                createView: {
                    fieldMode: 'hidden'
                },
                itemView: {
                    fieldMode: 'read'
                }
            }
        }),
        content: document({
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
        images: relationship({
          ref: 'BigPictureImage.bigPictureImages',
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
    },
    ui: {
        hideCreate: true,
        hideDelete: true,
    },
  });
  export default BigPicture;