'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react$1 = require('react');
var Link = require('next/link');
var urlGen = require('@cloudinary/url-gen');
var react = require('@cloudinary/react');
var jsxRuntime = require('react/jsx-runtime');
var Image$1 = require('next/image');
var create = require('zustand');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var Link__default = /*#__PURE__*/_interopDefault(Link);
var Image__default = /*#__PURE__*/_interopDefault(Image$1);
var create__default = /*#__PURE__*/_interopDefault(create);

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

const Video = ({
  thumbUrl,
  videoUrl,
  videoLabel
}) => {
  // Create store with Zustand
  const [useStore] = react$1.useState(() => create__default["default"](set => ({
    videoOpen: false,
    toggleOpen: open => set({
      videoOpen: open
    })
  })));
  const toggleOpen = useStore(state => state.toggleOpen);
  const videoOpen = useStore(state => state.videoOpen);
  return /*#__PURE__*/jsxRuntime.jsxs("div", {
    className: "relative video w-full h-full lg:mb-8",
    children: [videoOpen ? '' : /*#__PURE__*/jsxRuntime.jsxs("a", {
      href: "#",
      onClick: e => {
        toggleOpen(true);
        e.preventDefault();
      },
      children: [/*#__PURE__*/jsxRuntime.jsx(Image__default["default"], {
        alt: `Thumbnail image for video with title "${videoLabel}"`,
        src: thumbUrl,
        width: 1920,
        height: 1080,
        layout: "responsive",
        unoptimized: true
      }), /*#__PURE__*/jsxRuntime.jsx("span", {
        className: "absolute top-[calc(50%-75px)] left-[calc(50%-75px)]",
        children: /*#__PURE__*/jsxRuntime.jsxs("svg", {
          viewBox: "0 0 151 151",
          width: "151",
          height: "151",
          children: [/*#__PURE__*/jsxRuntime.jsx("circle", {
            style: {
              strokeWidth: '0.8px',
              stroke: '#B571E9',
              fill: 'rgba(141, 51, 210, .6)'
            },
            cx: "49.467",
            cy: "49.467",
            r: "49.467",
            transform: "matrix(1.521806, 0, 0, 1.510012, 0, 0)"
          }), /*#__PURE__*/jsxRuntime.jsx("path", {
            style: {
              strokeWidth: '0.8px',
              stroke: '#B571E9',
              fill: 'rgba(237, 234, 229, .8)'
            },
            d: "M 214.012 155.256 L 252.117 221.256 L 175.907 221.256 L 214.012 155.256 Z",
            "data-bx-shape": "triangle 175.907 155.256 76.21 66 0.5 0 1@b1f3cbc1",
            transform: "matrix(-0.000024, 1, -1, -0.000024, 268.262054, -141.660278)",
            "data-bx-origin": "0.53481 0.565042"
          })]
        })
      })]
    }), !videoOpen ? '' : /*#__PURE__*/jsxRuntime.jsx("div", {
      id: "video-embed",
      children: /*#__PURE__*/jsxRuntime.jsx("div", {
        className: "relative",
        style: {
          padding: '49.27% 0 0 0'
        },
        children: /*#__PURE__*/jsxRuntime.jsx("iframe", {
          src: `${videoUrl}?h=e72038724e&color=bf9eda&byline=0&portrait=0&autoplay=1`,
          style: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          },
          frameBorder: "0",
          allow: "autoplay; fullscreen; picture-in-picture",
          allowFullScreen: true
        })
      })
    })]
  });
};

const BlockRenderers = imageOveride => {
  let blocks = {
    image: props => {
      return /*#__PURE__*/jsxRuntime.jsx("div", {
        style: {
          display: 'flex',
          flexDirection: 'column'
        },
        children: /*#__PURE__*/jsxRuntime.jsx(Image, {
          id: 'img-' + props.image.publicId,
          alt: props.image.alt,
          imgId: props.image.publicId,
          aspectDefault: true
        })
      });
    },
    video: props => {
      return /*#__PURE__*/jsxRuntime.jsx(Video, {
        videoLabel: props.video.label,
        videoUrl: props.video.value,
        thumbUrl: props.video.thumb
      });
    },
    button: props => {
      return /*#__PURE__*/jsxRuntime.jsx(Link__default["default"], {
        href: props.link.props.node.children[0].text,
        passHref: true,
        children: /*#__PURE__*/jsxRuntime.jsx("button", {
          className: "block lg:inline-block rounded-full px-9 py-7 mt-4 uppercase whitespace-nowrap bg-lynx text-bluegreen border-2 border-bluegreen transition-all hover:bg-green-blue hover:text-lynx hover:border-green-blue",
          children: props.label
        })
      });
    }
  }; // if(imageOveride) blocks['image'] = imageOveride(props);

  return blocks;
};

const Favicon = () => {
  return /*#__PURE__*/jsxRuntime.jsxs(jsxRuntime.Fragment, {
    children: [/*#__PURE__*/jsxRuntime.jsx("link", {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/favicon/apple-touch-icon.png"
    }), /*#__PURE__*/jsxRuntime.jsx("link", {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/favicon/favicon-32x32.png"
    }), /*#__PURE__*/jsxRuntime.jsx("link", {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/favicon/favicon-16x16.png"
    }), /*#__PURE__*/jsxRuntime.jsx("link", {
      rel: "manifest",
      href: "/favicon/site.webmanifest"
    }), /*#__PURE__*/jsxRuntime.jsx("link", {
      rel: "mask-icon",
      href: "/favicon/safari-pinned-tab.svg",
      color: "#5bbad5"
    }), /*#__PURE__*/jsxRuntime.jsx("meta", {
      name: "apple-mobile-web-app-title",
      content: "Snippit"
    }), /*#__PURE__*/jsxRuntime.jsx("meta", {
      name: "application-name",
      content: "<APP NAME>"
    }), /*#__PURE__*/jsxRuntime.jsx("meta", {
      name: "msapplication-TileColor",
      content: "#ffc40d"
    }), /*#__PURE__*/jsxRuntime.jsx("meta", {
      name: "theme-color",
      content: "#ffffff"
    })]
  });
};

exports.BlockRenderers = BlockRenderers;
exports.Favicon = Favicon;
exports.Image = Image;
