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

const MediaImage: Lists.MediaImage = list({
  fields: {
    mediaImages: relationship({
      ref: 'MediaItem.images',
      many: true
    }),
    mediaGalleryImages: relationship({
      ref: 'MediaItem.galleryImages',
      many: true
    }),
    image: cloudinaryImage({
      cloudinary: {
        cloudName: `${process.env.CLOUDINARY_CLOUD_NAME}`,
        apiKey: `${process.env.CLOUDINARY_KEY}`,
        apiSecret: `${process.env.CLOUDINARY_SECRET}`,
        folder: 'tngvi/media',
      },
      label: 'Source',
    }),
    imageName: text({
      validation: {
        isRequired: true
      },
      defaultValue: 'Image'
    }),
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
export default MediaImage;