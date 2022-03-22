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

const Community: Lists.Community = list({
    fields: {
        name: text({
            isIndexed: 'unique',
            isFilterable: true,
            defaultValue: 'Community Page',
            ui: {
                createView: {
                    fieldMode: 'hidden'
                },
                itemView: {
                    fieldMode: 'read'
                }
            }
        }),
        values: document({
            formatting: {
                headingLevels: [4],
                inlineMarks: true,
                softBreaks: true,
            },
            ui: {
                views: path.join(process.cwd(), 'admin/components/component-blocks')
            },
            componentBlocks,
        }),
        community: document({
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
            
            relationships: {
              image: {
                kind: 'prop',
                listKey: 'CommunityImage',
                selection: 'imageName image {publicUrlTransformed publicId}',
              },
            },
        }),
        photos: relationship({
            ref: 'CommunityImage.communityImages',
            many: true,
            label: "Images (add here for use in 'Community' field)",
            ui: {
            displayMode: 'cards',
            cardFields: ['image', 'imageName'],
            inlineCreate: {
                fields: ['image', 'imageName']
            },
            inlineEdit: {
                fields: ['image', 'imageName']
            },
            },
        }),
    }
  });
  export default Community;