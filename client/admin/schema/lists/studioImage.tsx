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
import { cloudinaryImage } from '../../components/cloudinary';

const StudioImage: Lists.StudioImage = list({
  fields: {
    studioImages: relationship({ ref: 'Studio.photos', many: true }), 
    image: cloudinaryImage({
      cloudinary: {
        cloudName: `${process.env.CLOUDINARY_CLOUD_NAME}`,
        apiKey: `${process.env.CLOUDINARY_KEY}`,
        apiSecret: `${process.env.CLOUDINARY_SECRET}`,
        folder: 'tngvi',
      },
      label: 'Source',
    }),
    imageName: text({validation: {
      isRequired: true
    }}),
    altText: text({
      validation: {
        isRequired: true
      },
      label: 'Describe appearance of image'
    }),
    caption: text({
      validation: {
        isRequired: true,
      },
      defaultValue: 'Caption'
    }),
  },
  ui: {
    isHidden: true,
    labelField: 'imageName',
  },
});
export default StudioImage;