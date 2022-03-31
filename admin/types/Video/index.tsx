import {
    BaseListTypeInfo,
    FieldTypeFunc,
    CommonFieldConfig,
    fieldType,
    orderDirectionEnum,
    filters,
    KeystoneContext,
  } from '@keystone-6/core/types';
import { graphql } from '@keystone-6/core';
import process from 'process';
import path from 'path';

export type VideoFieldInputType =
| undefined
  | null
  | { url: string };

const VideoFieldInput = graphql.inputObject({
    name: 'VideoFieldInput',
    fields: {
      url: graphql.arg({ type: graphql.String }),
    },
});

//   const fileOutputFields = graphql.fields<Omit<FileData, 'type'>>()({
//     url: graphql.field({
//       type: graphql.nonNull(graphql.String),
//       resolve(data, args, context, info) {
//         const { key, typename } = info.path.prev as Path;
//         const config = _fieldConfigs[`${typename}-${key}`];
//         return getUrl(config, { type: 'file', ...data } as AzureStorageDataType);
//       },
//     }),
//   });
  
//   const AzureStorageFileFieldOutput = graphql.interface<Omit<FileData, 'type'>>()({
//     name: 'AzureStorageFileFieldOutput',
//     fields: fileOutputFields,
//     resolveType: () => 'AzureStorageFileFieldOutputType',
//   });
  
//   const AzureStorageFileFieldOutputType = graphql.object<Omit<FileData, 'type'>>()({
//     name: 'AzureStorageFileFieldOutputType',
//     interfaces: [AzureStorageFileFieldOutput],
//     fields: fileOutputFields,
//   });
  
export type VideoFieldConfig<ListTypeInfo extends BaseListTypeInfo> =
CommonFieldConfig<ListTypeInfo>;
  
  export const VideoField =
    <ListTypeInfo extends BaseListTypeInfo>({
      ...config
    }: VideoFieldConfig<ListTypeInfo> = {}): FieldTypeFunc<ListTypeInfo> =>
    meta =>
      fieldType({
        kind: 'multi',
        fields: {
            url: { kind: 'scalar', scalar: 'String', mode: 'required' }
        }
      })({
        input: {
            create: {
                arg: graphql.arg({ type: VideoFieldInput }),
                async resolve(value, context, resolve) {
                    return resolve(value);
                },
            },
            update: {
                arg: graphql.arg({ type: VideoFieldInput }),
                async resolve(value, context, resolve) {
                    return resolve(value);
                },
            }
        },
        output: graphql.field({ 
            type: graphql.String,
            resolve({ value, item }, args, context, info) {
              return value.url;
            }
        }),
        views: path.join(process.cwd(), 'admin/types/Video/view'),
      });