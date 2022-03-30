import {
  list
} from '@keystone-6/core';
import {
  relationship,
  text
} from '@keystone-6/core/fields';
import {
  Lists
} from '.keystone/types';
import {
  cloudinaryImage
} from '../../components/cloudinary';
import { document } from '@keystone-6/fields-document';

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
    image: cloudinaryImage({
      cloudinary: {
        cloudName: `${process.env.CLOUDINARY_CLOUD_NAME}`,
        apiKey: `${process.env.CLOUDINARY_KEY}`,
        apiSecret: `${process.env.CLOUDINARY_SECRET}`,
        folder: 'tngvi/people',
      },
      label: 'Bio Image',
    }),
    content: document({
        formatting: true,
        label: 'Bio/Content'
    }),
  }
});
export default Person;