
import inflection from 'inflection';
import {
    BaseListTypeInfo,
    fieldType,
    FieldTypeFunc,
    CommonFieldConfig,
    orderDirectionEnum,
    filters,
  } from '@keystone-6/core/types';
  import { graphql } from '@keystone-6/core';
import path from 'path';
  
  // this field is based on the integer field
  // but with validation to ensure the value is within an expected range
  // and a different input in the Admin UI
  // https://github.com/keystonejs/keystone/tree/main/packages/core/src/fields/types/integer
  function getResolvedIsNullable(
    validation: undefined | { isRequired?: boolean },
    db: undefined | { isNullable?: boolean }
  ): boolean {
    if (db?.isNullable === false) {
      return false;
    }
    if (db?.isNullable === undefined && validation?.isRequired) {
      return false;
    }
    return true;
  }

  export type VideoFieldConfig<ListTypeInfo extends BaseListTypeInfo> =
    CommonFieldConfig<ListTypeInfo> &
    (
      | {
          /**
           * When a value is provided as just a string, it will be formatted in the same way
           * as field labels are to create the label.
           */
          options: readonly ({ label: string; value: string } | string)[];
          /**
           * If `enum` is provided on SQLite, it will use an enum in GraphQL but a string in the database.
           */
          type?: 'string' | 'enum';
          defaultValue?: string;
        }
      | {
          options: readonly { label: string; value: number }[];
          type: 'integer';
          defaultValue?: number;
        }
    ) & {
      validation?: {
        /**
         * @default false
         */
        isRequired?: boolean;
      };
      isIndexed?: boolean | 'unique';
      graphql?: {
        create?: {
          isNonNull?: boolean;
        };
        read?: {
          isNonNull?: boolean;
        };
      };
      db?: {
        isNullable?: boolean;
        map?: string;
      };
    };

  
  export const video =
    <ListTypeInfo extends BaseListTypeInfo>({
        isIndexed,
        defaultValue,
        validation,
        ...config
      }: VideoFieldConfig<ListTypeInfo>): FieldTypeFunc<ListTypeInfo> =>
      meta => {
        const fieldLabel = config.label;

        const resolvedIsNullable = getResolvedIsNullable(validation, config.db);
        const commonConfig = (
          options: readonly { value: string | number; label: string }[]
        ): CommonFieldConfig<ListTypeInfo> & {
          views: string;
          getAdminMeta: () => import('./views').AdminSelectFieldMeta;
        } => {
          const values = new Set(options.map(x => x.value));
          if (values.size !== options.length) {
            throw new Error(
              `The select field at ${meta.listKey}.${meta.fieldKey} has duplicate options, this is not allowed`
            );
          }
          return {
            ...config,
            hooks: {
              ...config.hooks,
              async validateInput(args) {
                const value = args.resolvedData[meta.fieldKey];
                if (value != null && !values.has(value)) {
                  args.addValidationError(`${value} is not a possible value for ${fieldLabel}`);
                }
                await config.hooks?.validateInput?.(args);
              },
            },
            views: path.join(__dirname, 'views'),
            getAdminMeta: () => ({
              options,
              type: config.type ?? 'string',
              defaultValue: defaultValue ?? null,
              isRequired: validation?.isRequired ?? false,
            }),
          };
        };
        const mode = resolvedIsNullable === false ? 'required' : 'optional';
        const commonDbFieldConfig = {
          mode,
          index: isIndexed === true ? 'index' : isIndexed || undefined,
          default:
            defaultValue === undefined
              ? undefined
              : { kind: 'literal' as const, value: defaultValue as any },
          map: config.db?.map,
        } as const;
    
        const resolveCreate = <T extends string | number>(val: T | null | undefined): T | null => {
          if (val === undefined) {
            return (defaultValue as T | undefined) ?? null;
          }
          return val;
        };
    
        const output = <T extends graphql.NullableOutputType>(type: T) =>
          config.graphql?.read?.isNonNull ? graphql.nonNull(type) : type;
    
        const create = <T extends graphql.NullableInputType>(type: T) => {
          const isNonNull = config.graphql?.read?.isNonNull === true;
          return graphql.arg({
            type: isNonNull ? graphql.nonNull(type) : type,
            defaultValue: isNonNull ? defaultValue : undefined,
          });
        };
    
        const options = config.options.map(option => {
          if (typeof option === 'string') {
            return {
              label: option,
              value: option,
            };
          }
          return option;
        });
    
        if (config.type === 'enum') {
          const enumName = `${meta.listKey}${inflection.classify(meta.fieldKey)}Type`;
          const graphQLType = graphql.enum({
            name: enumName,
            values: graphql.enumValues(options.map(x => x.value)),
          });
          return fieldType(
            meta.provider === 'sqlite'
              ? { kind: 'scalar', scalar: 'String', ...commonDbFieldConfig }
              : {
                  kind: 'enum',
                  values: options.map(x => x.value),
                  name: enumName,
                  ...commonDbFieldConfig,
                }
          )({
            ...commonConfig(options),
            input: {
              uniqueWhere:
                isIndexed === 'unique' ? { arg: graphql.arg({ type: graphQLType }) } : undefined,
              where: {
                arg: graphql.arg({ type: filters[meta.provider].enum(graphQLType).optional }),
                resolve: mode === 'required' ? undefined : filters.resolveCommon,
              },
              create: { arg: create(graphQLType), resolve: resolveCreate },
              update: { arg: graphql.arg({ type: graphQLType }) },
              orderBy: { arg: graphql.arg({ type: orderDirectionEnum }) },
            },
            output: graphql.field({ type: output(graphQLType) }),
          });
        }
        return fieldType({ kind: 'scalar', scalar: 'String', ...commonDbFieldConfig })({
          ...commonConfig(options),
          input: {
            uniqueWhere:
              isIndexed === 'unique' ? { arg: graphql.arg({ type: graphql.String }) } : undefined,
            where: {
              arg: graphql.arg({ type: filters[meta.provider].String[mode] }),
              resolve: mode === 'required' ? undefined : filters.resolveString,
            },
            create: { arg: create(graphql.String), resolve: resolveCreate },
            update: { arg: graphql.arg({ type: graphql.String }) },
            orderBy: { arg: graphql.arg({ type: orderDirectionEnum }) },
          },
          output: graphql.field({ type: output(graphql.String) }),
        });
      };