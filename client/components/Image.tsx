import React, {
    Component
} from 'react';

import {Cloudinary} from "@cloudinary/url-gen";
import {
    AdvancedImage,
    lazyload,
    placeholder,
    responsive,
} from '@cloudinary/react';
import { Plugins } from '@cloudinary/html';

// Cloudinary instance
const cld = new Cloudinary({
    cloud: {
        cloudName: `engagement-lab-home`,
    },
    url: {
        secure: true,
    },
});

type ImageProps = {
    alt: string,
    id: string,
    imgId: string,
    className ? : string,
    transforms ? : string,
    width ? : number,
    height ? : number,
    lazy ? : boolean,
};

const Image = ({
    alt,
    className,
    id,
    imgId,
    transforms,
    width,
    height,
    lazy
}: ImageProps) => {
    // Instantiate a CloudinaryImage object for the image with public ID;
    const cloudImage = cld.image(`${imgId}`);
    const imgHeight = height || (width ? width*.75 : undefined);
    let plugins: Plugins = [responsive({steps: [800, 1000, 1400]})];
    // Create image transforms
    cloudImage.addTransformation(transforms || `f_auto,dpr_auto,c_crop,g_center,ar_4:3`);

    // If lazyload not set to false, enable
    if (lazy === undefined)
        plugins.push(
            lazyload(),
            // accessibility(),
            placeholder({mode:'blur'})
        );

        return(        
            <AdvancedImage
                id={id}
                className={className}
                cldImg={cloudImage}
                alt={alt}
                plugins={plugins}
                style={{ maxWidth: width + `px` }}
            />
            );
}

export default Image;