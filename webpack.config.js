var getConfig = require('hjs-webpack');

module.exports = getConfig({
  // entry point for the app
  in: 'src/base/base-es2015.js',
  // output directory
  out: 'public',
  // remove and recreate public folder on build
  clearBeforeBuild: true,
  // check if webserver should be run in development mode
  isDev: process.env.NODE_ENV !== 'production'
});