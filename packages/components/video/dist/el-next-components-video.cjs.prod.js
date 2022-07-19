'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Image = require('next/image');
var react = require('react');
var create = require('zustand');
var jsxRuntime = require('react/jsx-runtime');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var Image__default = /*#__PURE__*/_interopDefault(Image);
var create__default = /*#__PURE__*/_interopDefault(create);

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

var Video = function Video(_ref2) {
  var thumbUrl = _ref2.thumbUrl,
      videoUrl = _ref2.videoUrl,
      videoLabel = _ref2.videoLabel;

  // Create store with Zustand
  var _useState = react.useState(function () {
    return create__default["default"](function (set) {
      return {
        videoOpen: false,
        toggleOpen: function toggleOpen(open) {
          return set({
            videoOpen: open
          });
        }
      };
    });
  }),
      _useState2 = _slicedToArray(_useState, 1),
      useStore = _useState2[0];

  var toggleOpen = useStore(function (state) {
    return state.toggleOpen;
  });
  var videoOpen = useStore(function (state) {
    return state.videoOpen;
  });
  return /*#__PURE__*/jsxRuntime.jsxs("div", {
    className: "relative video w-full h-full lg:mb-8",
    children: [videoOpen ? '' : /*#__PURE__*/jsxRuntime.jsxs("a", {
      href: "#",
      onClick: function onClick(e) {
        toggleOpen(true);
        e.preventDefault();
      },
      children: [/*#__PURE__*/jsxRuntime.jsx(Image__default["default"], {
        alt: "Thumbnail image for video with title \"".concat(videoLabel, "\""),
        src: thumbUrl,
        width: 1920,
        height: 1080,
        layout: "responsive",
        unoptimized: true
      }), /*#__PURE__*/jsxRuntime.jsx("span", {
        className: "absolute",
        style: {
          top: 'calc(50% - 75px)',
          left: 'calc(50% - 75px)'
        },
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
          src: "".concat(videoUrl, "?h=e72038724e&color=bf9eda&byline=0&portrait=0&autoplay=1"),
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
