import { JSXElementConstructor, ReactElement } from "react";

// This is a renderer component that overrides Keystone's default layout DocumentRendererProp to use flex, rather than grid layout, allowing for responsive layout
const FlexLayout = (layout: [number, ...number[]], children: ReactElement<any, string | JSXElementConstructor<any>>[]) => {
    const flexClass = 'flex gap-x-5 flex-col-reverse md:flex-row';
    if(layout[0] === 2 && layout[1] === 1) {
        return (
            <div
                className={flexClass}
            >
            {children.map((element, i) => (
                <div key={i} className={`${i === 0 ? 'w-full lg:w-3/4' : ''}`}>{element}</div>
            ))}
            </div>
        );
    }
    else if(layout[0] === 1 && layout[1] === 1) {
        return (
            <div
                className={flexClass}
            >
            {children.map((element, i) => (
                <div key={i} className={`${i === 0 ? 'w-full lg:w-1/2' : ''}`}>{element}</div>
            ))}
            </div>
        );
    }
    else if(layout[0] === 1 && layout[1] === 1 && layout[2] === 1) {
        return (
            <div
                className={flexClass}
            >
            {children.map((element, i) => (
                <div key={i} className='w-full lg:w-1/3'>{element}</div>
            ))}
            </div>
        );
    }
    else return <div>{children}</div>;
}

export default FlexLayout;
