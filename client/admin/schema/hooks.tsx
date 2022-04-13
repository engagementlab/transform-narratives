import { AboutCreateInput, BigPictureCreateInput } from ".keystone/types";

export function CreateKey(name: string) {
    return name.toLocaleLowerCase().replaceAll(/[^a-z+A-Z+0-9+]/ig, '-').replace(/-{2,}/g, '-')
}
export const FixButtons = (resolvedData: AboutCreateInput | BigPictureCreateInput) => { 
      
    // Hacky, but works for now to ensure that buttons in content get assigned props
    let contentParsed = JSON.parse(resolvedData.content as string);
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
    
    return JSON.stringify(contentParsed); 
 };