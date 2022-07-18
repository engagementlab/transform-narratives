'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./el-next-components.cjs.prod.js");
} else {
  module.exports = require("./el-next-components.cjs.dev.js");
}
