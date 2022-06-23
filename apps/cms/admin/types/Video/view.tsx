import { CellLink, CellContainer } from "@keystone-6/core/admin-ui/components";
import { FieldControllerConfig, FieldController, CardValueComponent, CellComponent, FieldProps } from "@keystone-6/core/types";
import { FieldContainer, FieldLabel, TextInput } from '@keystone-ui/fields';
import { useState } from "react";
import Select from "react-select/dist/declarations/src/Select";

export type AdminSelectFieldMeta = {
    options: readonly { label: string; value: string | number }[];
    isRequired: boolean;
    defaultValue: string | number | null;
  };
  
type Config = FieldControllerConfig<AdminSelectFieldMeta>;
  
type Option = { label: string; value: string };

type Value =
  | { value: Option | null; kind: 'create' }
  | { value: Option | null; initial: Option | null; kind: 'update' };

export const controller = (config: Config)  => {

    const optionsWithStringValues = config.fieldMeta.options.map(x => ({
    label: x.label,
        value: x.value.toString(),
    }));
    return {
      options: optionsWithStringValues,
      label: config.label,
      graphqlSelection: config.path,
      // deserialize: data => {
      //   const value = data[config.path];
      //   return value;
      // },
      // serialize: value => ({ [config.path]: value }),
      // filter: {
        // Filter(props) {
        //     return (
        //       <MultiSelect
        //         onChange={props.onChange}
        //         options={optionsWithStringValues}
        //         value={props.value}
        //         autoFocus
        //       />
        //     );
        //   },
        //   graphql: ({ type, value: options }) => ({
        //     [config.path]: { [type === 'not_matches' ? 'notIn' : 'in']: options.map(x => t(x.value)) },
        //   }),
        //   Label({ type, value }) {
        //     if (!value.length) {
        //       return type === 'not_matches' ? `is set` : `has no value`;
        //     }
        //     if (value.length > 1) {
        //       const values = value.map(i => i.label).join(', ');
        //       return type === 'not_matches' ? `is not in [${values}]` : `is in [${values}]`;
        //     }
        //     const optionLabel = value[0].label;
        //     return type === 'not_matches' ? `is not ${optionLabel}` : `is ${optionLabel}`;
        //   },
        //   types: {
        //     matches: {
        //       label: 'Matches',
        //       initialValue: [],
        //     },
        //     not_matches: {
        //       label: 'Does not match',
        //       initialValue: [],
        //     },
        //   },
    }
}

// export const Field = ({ field, value, onChange, autoFocus }: FieldProps<typeof controller>) => {

//     const [hasChanged, setHasChanged] = useState(false);
//     return (
//         <FieldContainer>
//         <FieldLabel>{field.label}</FieldLabel>
//         {/* {onChange && ( */}
//         {/* <div className={styles.form.field}> */}
//                 {/* <Select
//                 id={field.path}
//                 isClearable
//                 autoFocus={autoFocus}
//                 options={field.options}
//                 isDisabled={onChange === undefined}
//                 onChange={newVal => {
//                     onChange?.({ ...value, value: newVal });
//                     setHasChanged(true);
//                   }}
//                 value={value.value}
//                 // className={styles.form.select}
//                 components={{Option: CustomOptionComponent as ComponentType<OptionProps<RelatedVideo, boolean, GroupBase<RelatedVideo>>>}}
    
//                 /> */}
//             {/* </div> */}
//         {/* )} */}
//         </FieldContainer>
//     );
// };

export const Cell: CellComponent = ({ item, field, linkTo }) => {
    let value = item[field.path] + '';
    return linkTo ? <CellLink {...linkTo}>{value}</CellLink> : <CellContainer>{value}</CellContainer>;
  };
  Cell.supportsLinkTo = true;
  
export const CardValue: CardValueComponent = ({ item, field }) => {
  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      {item[field.path]}
    </FieldContainer>
  );
};

function t(value: string): any {
    throw new Error("Function not implemented.");
  }
