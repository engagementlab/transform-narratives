import React, {
    Component
} from 'react';
import PropTypes from 'prop-types';

import {
    Cloudinary
} from '@cloudinary/base';
import {
    AdvancedImage,
    lazyload,
    placeholder,
    responsive,
} from '@cloudinary/react';

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
    // append dir prefix if missing
    const prefix =
        imgId.indexOf(`mapping-impactful-media/img/`) > -1 ?
        `` :
        `mapping-impactful-media/img/`;
    const cloudImage = cld.image(`${imgId}`);
    let plugins = [];

    // Create image transforms
    cloudImage.addTransformation(transforms || `f_auto,dpr_auto`);

    // If lazyload not set to false, enable
    if (lazy === undefined)
        plugins.push(
            responsive([800, 1000, 1400]),
            lazyload(),
            placeholder(`blur`)
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