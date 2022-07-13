'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('react');
var urlGen = require('@cloudinary/url-gen');
var react = require('@cloudinary/react');
var jsxRuntime = require('react/jsx-runtime');

// Cloudinary instance
const cld = new urlGen.Cloudinary({
  cloud: {
    cloudName: `engagement-lab-home`
  },
  url: {
    secure: true
  }
});
const Image = ({
  alt,
  className,
  id,
  imgId,
  transforms,
  width,
  lazy,
  aspectDefault
}) => {
  // Instantiate a CloudinaryImage object for the image with public ID;
  const cloudImage = cld.image(`${imgId}`);
  let plugins = [react.responsive({
    steps: [800, 1000, 1400]
  })]; // Create image transforms

  cloudImage.addTransformation(transforms || `f_auto,dpr_auto,c_crop,g_center${aspectDefault ? '' : ',ar_4:3'}`); // If lazyload not set to false, enable

  if (lazy === undefined) plugins.push(react.lazyload(), react.placeholder({
    mode: 'blur'
  }));
  return /*#__PURE__*/jsxRuntime.jsx(react.AdvancedImage, {
    id: id,
    className: className,
    cldImg: cloudImage,
    alt: alt,
    plugins: plugins,
    style: {
      maxWidth: width + `px`
    }
  });
};

exports.Image = Image;
