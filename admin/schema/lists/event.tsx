import {
    list
  } from '@keystone-6/core';
import {
    json,
    relationship,
    text,
    timestamp
} from '@keystone-6/core/fields';
import {
    document
} from '@keystone-6/fields-document';
import {
    Lists
} from '.keystone/types';
import path from 'path';
import { componentBlocks } from '../../components/component-blocks';
import { cloudinaryImage } from '../../components/cloudinary';

const Event: Lists.Event = list({
    fields: {
      name: text({
        validation: {
          isRequired: true
        }
      }),
      key: text({
        isIndexed: 'unique',
        isFilterable: true,
        ui: {
          createView: {
            fieldMode:'hidden'
          },
          itemView: {
            fieldMode: 'hidden'
          }
        }
      }),
      thumbnail: cloudinaryImage({
        label: 'Thumbnail/Header Image',
        cloudinary: {
          cloudName: `${process.env.CLOUDINARY_CLOUD_NAME}`,
          apiKey: `${process.env.CLOUDINARY_KEY}`,
          apiSecret: `${process.env.CLOUDINARY_SECRET}`,
          folder: 'tngvi/events',
        },
      }),
      thumbAltText: text({
        validation: {
          isRequired: true
        },
        label: 'Describe appearance of Thumbnail/Header Image'
      }),
      eventDate: timestamp({
          // validation:{
          //     isRequired: true,
          // }
      }),
      registrationLink: text({
        // validation: {
        //   match: { 
        //     regex: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm,
        //     explanation: 'Not a valid URL'
        //   }
        // },
      }),
      address: text({
        ui: {
          displayMode: 'textarea'
        }
      }),
      blurb: text({
        validation: {
          isRequired: true
        },
        ui: {
          displayMode: 'textarea'
        }
      }),
      content: document({
        formatting: {
          headingLevels: [2, 3, 4],
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
  
        relationships: {
          image: {
            kind: 'prop',
            listKey: 'EventImage',
            selection: 'imageName altText caption image {publicUrlTransformed publicId}',
          },
        },
      }),
      // speakers: relationship({
      //   ref: 'Person',
      //   isFilterable: true,
      //   many: true,
      // }),
      images: relationship({
        ref: 'EventImage.eventImages',
        many: true,
        label: "Document Images (add here for use in 'Content/Bios' fields)",
        ui: {
          displayMode: 'cards',
          cardFields: ['image', 'imageName', 'altText', 'caption'],
          inlineCreate: {
            fields: ['image', 'imageName', 'altText', 'caption']
          },
          inlineEdit: {
            fields: ['image', 'imageName', 'altText', 'caption']
          },
        },
      }),
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
            key: resolvedData.name.toLocaleLowerCase().replaceAll(/\s/ig, '-')
          }
  
        }
        return resolvedData;
      }
    }
  });
  export default Event;