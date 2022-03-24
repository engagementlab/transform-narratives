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

const BigPictureImage: Lists.CommunityImage = list({
  fields: {
    bigPictureImages: relationship({ ref: 'BigPicture.images', many: true }), 
    image: cloudinaryImage({
      cloudinary: {
        cloudName: `${process.env.CLOUDINARY_CLOUD_NAME}`,
        apiKey: `${process.env.CLOUDINARY_KEY}`,
        apiSecret: `${process.env.CLOUDINARY_SECRET}`,
        folder: 'tngvi/community',
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
  },
  ui: {
    isHidden: true,
    labelField: 'imageName',
  },
});
export default BigPictureImage;