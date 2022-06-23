import {
    list
  } from '@keystone-6/core';
import {
  checkbox,
    select,
    text
} from '@keystone-6/core/fields';
import {
    Lists
} from '.keystone/types';
import { CreateKey } from '../../hooks';

const Filter: Lists.Filter = list({
    fields: {
    //   mediaRef: relationship({ ref: 'MediaItem.filters', many: true }),
      name: text({
        validation: {
          isRequired: true
        }
      }),
      key: text({
        ui: {
          createView: {
            fieldMode:'hidden'
          },
          itemView: {
            fieldMode: 'hidden'
          }
        }
      }),
      enabled: checkbox({
        defaultValue: true,
      }),
      type: select({
        type: 'enum',
        options: [
          { label: 'Voice', value: 'Voices' },
          { label: 'Media', value: 'Media' },
          { label: 'Studio Dept', value: 'Departments' },
          { label: 'Year', value: 'Year' },
          { label: 'Department', value: 'Department' },
          { label: 'Partner', value: 'Partner' },
          { label: 'Faculty', value: 'Faculty' },
          { label: 'Semester', value: 'Semester' },
          
        ],
        validation: { isRequired: true, },
        ui: { displayMode: 'select' },
      }),
      section: select({
        type: 'enum',
        options: [
          { label: 'Media', value: 'media' },
          { label: 'Studio', value: 'studio' },
        ],
        ui: { displayMode: 'segmented-control' },
      }),
      // order: integer(),
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
            key: CreateKey(resolvedData.name)
          }
  
        }
        return resolvedData;
      }
    },
    ui: {
      listView: { 
        initialColumns: ['name', 'section']
      }
    }
  });
  export default Filter;