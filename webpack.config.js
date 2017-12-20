var path = require("path")
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')

module.exports = {
  context: __dirname,

  entry: {
    index: './static_src/js/entreeIndex.js',
    jipiadmin: './static_src/js/entreejpadm.js'
  },
  // entry point of our app. assets/js/index.js should require other js modules and dependencies it needs

  output: {
    path: path.resolve('./static_src/bundles/'),
    publicPath: '/static/bundles/',
    filename: "[name]-[hash].js"
  },

  plugins: [new BundleTracker({filename: './webpack-stats.json'})],

  module: {
    loaders: [
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: true
            }
          }
        ]
      }, {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }, {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader",
            options: {
              minimize: true
            } // creates style nodes from JS strings
          }, {
            loader: "css-loader",
            options: {
              minimize: true
            } // translates CSS into CommonJS
          }, {
            loader: "sass-loader",
            options: {
              minimize: true
            } // compiles Sass to CSS
          }
        ]
      }, {
        test: /.*\.(gif|png|jpe?g|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: '[name].[ext]',
              path:'./static_src/bundles/',
            }
          }

        ]
      }
    ]
  },

  resolve: {
    // modulesDirectories: ['node_modules'],
    extensions: ['.css', '.scss', '.jpg', '.png', '.js', '.html']
  }
}
