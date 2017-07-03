var path = require("path")
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')

module.exports = {
  context: __dirname,
  // entry point of our app. assets/js/index.js should require other js modules and dependencies it needs
  entry: {
    "index": './src/js/index',
    "questionAsker": './src/js/questionAsker',
    "mainMenu": './src/js/mainMenu',
    "dashboard": './src/js/dashboard.js',
    "teacherHome": './src/js/teacherHome.js'
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
    extensions: ['', '.js', '.jsx'],
    alias: {
      questionAsker: path.resolve(__dirname, 'src/js/questionAsker'),
      helpers: path.resolve(__dirname, 'src/js/helpers')
    }
  },
}
