import {
    list
  } from '@keystone-6/core';
import {
    json,
    relationship,
    select,
    text
} from '@keystone-6/core/fields';
import {
    document
} from '@keystone-6/fields-document';
import {
    Lists
} from '.keystone/types';

const Filter: Lists.Filter = list({
    fields: {
    //   mediaRef: relationship({ ref: 'MediaItem.filters', many: true }),
      name: text({
        validation: {
          isRequired: true
        }
      }),
      type: select({
        type: 'enum',
        options: [
          { label: 'Voice', value: 'Voices' },
          { label: 'Media', value: 'Media' },
          { label: 'Studio Dept', value: 'Departments' },
          { label: 'Year', value: 'Year' },
          
        ],
        validation: { isRequired: true, },
        ui: { displayMode: 'segmented-control' },
      }),
      section: select({
        type: 'enum',
        options: [
          { label: 'Media', value: 'media' },
          { label: 'Studio', value: 'studio' },
        ],
        ui: { displayMode: 'segmented-control' },
      }),
    }
  });
  export default Filter;