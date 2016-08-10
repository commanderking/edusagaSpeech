var path = require("path")
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')

module.exports = {
  context: __dirname,
  // entry point of our app. assets/js/index.js should require other js modules and dependencies it needs
  entry: {
    "index": './react_assets/js/index',
    "questionAsker": './react_assets/js/questionAsker'
  },
  output: {
      path: path.resolve('./static/js/'),
      filename: "bundle_[name].js",
  },

  plugins: [
    new BundleTracker({filename: './webpack-stats.json'}),
  ],

  module: {
    loaders: [
      { test: /\.js?$/, exclude: /node_modules/, loader: 'babel-loader'}, // to transform JSX into JS
      { test: /\.scss$/, loaders: ["style", "css", "sass"] }
    ],
  },

  resolve: {
    modulesDirectories: ['node_modules', 'bower_components'],
    extensions: ['', '.js', '.jsx']
  },
}
