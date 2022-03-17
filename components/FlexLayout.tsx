import { JSXElementConstructor, ReactElement } from "react";

// This is a renderer component that overrides Keystone's default layout DocumentRendererProp to use flex, rather than grid layout, allowing for responsive layout
const FlexLayout = (layout: [number, ...number[]], children: ReactElement<any, string | JSXElementConstructor<any>>[]) => {
    if(layout[0] === 2 && layout[1] === 1) {
        return (
            <div
                className='flex gap-x-10 flex-col-reverse lg:flex-row'
            >
            {children.map((element, i) => (
                <div key={i} className={`${i === 0 ? 'w-full lg:w-2/3' : ''}`}>{element}</div>
            ))}
            </div>
        );
    }
    else return <div>{children}</div>;
}

export default FlexLayout;
