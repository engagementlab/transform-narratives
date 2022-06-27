const path = require('path');
module.exports = {
  entry: './launch.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  //   resolve: {
  //     extensions: ['.webpack.js', '.web.js', '.ts', '.js'],
  //   },
  module: {
    rules: [{ test: /launch.ts/, loader: 'ts-loader' }],
  },
};
