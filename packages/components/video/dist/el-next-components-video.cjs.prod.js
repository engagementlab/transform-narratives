'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Image = require('next/image');
var react = require('react');
var create = require('zustand');
var jsxRuntime = require('react/jsx-runtime');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var Image__default = /*#__PURE__*/_interopDefault(Image);
var create__default = /*#__PURE__*/_interopDefault(create);

const Video = ({
  thumbUrl,
  videoUrl,
  videoLabel
}) => {
  // Create store with Zustand
  const [useStore] = react.useState(() => create__default["default"](set => ({
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

exports.Video = Video;
