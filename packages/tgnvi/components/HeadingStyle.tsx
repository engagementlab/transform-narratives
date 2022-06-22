import { ReactNode } from "react";

// type HeadingAlign: 

// This is a renderer component that overrides Keystone's default document header styles with our default one and further optional ones per heading lvl
const HeadingStyle = (level: number, children: ReactNode, textAlign: "center" | "end" | undefined, customRenderers?: { [x: number]: string }) => {

    const defaultClass = `${level === 3 && 'h3 text-2xl text-coated leading-none'} ${level === 4 && 'text-md text-coated mt-8 lg:mt-12 mb-2'} font-semibold`;
    const customClass = customRenderers && customRenderers[level];
    
    return <p className={customClass || defaultClass} style={{ textAlign }}>{children}</p>;

}

export default HeadingStyle;
