// References:
// - https://alchemy.com/blog/how-to-polyfill-node-core-modules-in-webpack-5
// - https://github.com/facebook/create-react-app/pull/11764#issuecomment-1162303571

const webpack = require('webpack');

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};

  Object.assign(fallback, {
    "assert": require.resolve("assert"),
    "fs": false,
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "path": require.resolve("path-browserify"),
    "stream": require.resolve("stream-browserify"),
    "url": require.resolve("url"),
    "util": require.resolve("util"),
    "zlib": require.resolve("browserify-zlib"),
  })

  config.resolve.fallback = fallback;

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    })
  ])

  return config;
}
