import {
  list
} from '@keystone-6/core';
import {
  checkbox,
  text
} from '@keystone-6/core/fields';
import { document } from '@keystone-6/fields-document';
import {
  Lists
} from '.keystone/types';
import {
  cloudinaryImage
} from '../../../components/cloudinary';
import { CreatedTimestamp } from '../../hooks';

const Person: Lists.Person = list({
  fields: {
    name: text({
      validation: {
        isRequired: true
      }
    }),
    title: text({
      label: 'Title/Role',
      validation: {
        isRequired: true
      }
    }),
    createdDate: CreatedTimestamp,
    enabled: checkbox({
      defaultValue: true,
    }),
    image: cloudinaryImage({
      cloudinary: {
        cloudName: `${process.env.CLOUDINARY_CLOUD_NAME}`,
        apiKey: `${process.env.CLOUDINARY_KEY}`,
        apiSecret: `${process.env.CLOUDINARY_SECRET}`,
        folder: 'tngvi/people',
      },
      label: 'Bio Image',
    }),
    blurb: text({
      label: 'What brings you here?',
      ui: {
        displayMode: 'textarea'
      }
    }),
    remembrance: text({
      label: 'In remembrance of...'
    }),
    content: document({
        formatting: true,
        label: 'Full Bio/Content'
    }),
  },
  ui: {
    listView: { 
      initialColumns: ['name', 'title', 'image']
    }
  }
});
export default Person;