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
    }
  });
  export default Community;