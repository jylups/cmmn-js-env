'use strict';

var path = require('path');

var HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * Bundles the playground from the workspace sources of cmmn-js, the Flowable
 * properties panel and flowable-cmmn-moddle. Those packages are linked into
 * node_modules by npm workspaces; webpack follows the links to their real
 * folders, so editing a package's source rebuilds and reloads the page.
 */
module.exports = {
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.cmmn$/,
        type: 'asset/source'
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                math: 'always'
              }
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      title: 'Flowable CMMN playground'
    })
  ],
  devServer: {
    port: 8080,
    open: false,
    client: {
      overlay: {
        warnings: false
      }
    }
  },
  performance: {
    hints: false
  }
};
