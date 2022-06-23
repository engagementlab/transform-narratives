import { AboutCreateInput, BigPictureCreateInput } from ".keystone/types";
import { timestamp } from "@keystone-6/core/fields";
import _ from 'lodash';

export function CreateKey(name: string) {
    let keyGen = name.toLocaleLowerCase().replaceAll(/[^\w ]/g, '').replaceAll(/[^a-z+A-Z+0-9+]/ig, '-').replace(/-{2,}/g, '-')
    if(keyGen.lastIndexOf('-') === keyGen.length-1) 
        keyGen = keyGen.slice(0, keyGen.length - 1)
    return keyGen;
}
export const FixButtons = (resolvedData: AboutCreateInput | BigPictureCreateInput) => {
    if(!resolvedData.content) return resolvedData.content;

    // Hacky, but works for now to ensure that buttons in content get assigned props
    // Content may be object or string, it seems (copy it)
    let contentParsed = typeof resolvedData.content === 'object' ? _.cloneDeep(resolvedData.content) : JSON.parse(resolvedData.content as string);

    let parseChildren = (c: any) => {
        if(c.component === 'button') {
            c.props.label = c.children[0].children[0].text;
            c.props.link = c.children[1].children[0].text;
        }
        // Recursively move through all children
        c.children.forEach((c2: { children: any; }) => {
            if(c2.children)
                parseChildren(c2)
        });
    }

    contentParsed.forEach((c: any) => { parseChildren(c) });

    return typeof resolvedData.content === 'object' ? contentParsed : JSON.stringify(contentParsed);
 };

export const CreatedTimestamp = timestamp({
    ui: {
    createView: {
        fieldMode:'hidden'
    },
    itemView: {
        fieldMode: 'hidden'
    }
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
        if(operation === 'create') {
        return new Date().toISOString();
        }
    }
    }
});