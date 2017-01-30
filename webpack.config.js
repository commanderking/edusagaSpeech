var path = require("path")
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')

module.exports = {
  context: __dirname,
  // entry point of our app. assets/js/index.js should require other js modules and dependencies it needs
  entry: {
    "index": './react_assets/js/index',
    "questionAsker": './react_assets/js/questionAsker',
    "mainMenu": './react_assets/js/mainMenu',
    "dashboard": './react_assets/js/dashboard.js',
    "teacherHome": './react_assets/js/teacherHome.js'
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
      { test: /\.scss$/, loaders: ["style", "css", "sass"] },
      { test: /\.css$/, loader: "style-loader!css-loader" }
    ],
    rules: [
      { test: /\.json$/, use: 'json-loader' }
    ]
  },

  resolve: {
    modulesDirectories: ['node_modules', 'bower_components'],
    extensions: ['', '.js', '.jsx']
  },
}
