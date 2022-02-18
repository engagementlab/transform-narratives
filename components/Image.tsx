import React, {
    Component
} from 'react';
import PropTypes from 'prop-types';

import {Cloudinary} from "@cloudinary/url-gen";
import {
    AdvancedImage,
    lazyload,
    accessibility,
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
    lazy ? : boolean,
};

const Image = ({
    alt,
    className,
    id,
    imgId,
    transforms,
    width,
    lazy
}: ImageProps) => {
    // Instantiate a CloudinaryImage object for the image with public ID;
    // TODO: append dir prefix if missing
    const cloudImage = cld.image(`${imgId}`);
    let plugins: Plugins = [];

    // Create image transforms
    cloudImage.addTransformation(transforms || `f_auto,dpr_auto`);

    // If lazyload not set to false, enable
    if (lazy === undefined)
        plugins.push(
            lazyload(),
            responsive({steps: [800, 1000, 1400]}),
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