const autoprefixer = require('autoprefixer');
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const production = process.env.NODE_ENV === 'production';

var plugins = null;
var externals = {};

if (production) {
  plugins = [
    // new CopyWebpackPlugin([
    //     {from: 'img', to: 'img'},
    // ]),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.MinChunkSizePlugin({
      minChunkSize: 51200,
    }),
    new webpack.DefinePlugin({
      'process.env': {'NODE_ENV': JSON.stringify('production')}
    }),
    new webpack.LoaderOptionsPlugin({minimize: true}),
    new webpack.optimize.UglifyJsPlugin({
      compress: {warnings: false},
      comments: false
    }),
    new ExtractTextPlugin('[name].css'),
  ];

  externals = {
    react: 'React',
    'react-dom': 'ReactDOM',
  };
} else {
  plugins = [
    // new CopyWebpackPlugin([
    //     {from: 'img', to: 'img'},
    // ]),
    new webpack.LoaderOptionsPlugin({debug: true}),
    new ExtractTextPlugin('[name].css'),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ];
}

module.exports = {
  entry: {
    index: './js/index.js',
    main: './js/main.js',
  },

  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: '[name].js'
  },

  context: path.join(__dirname, 'src'),

  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }, {
      test: /\.pug$/,
      loader: 'pug-loader'
    }, {
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
          options: {importLoaders: true},
        }, {
          loader: 'postcss-loader',
          options: {
            plugins: function() {
              return [autoprefixer];
            }
          }
        }, {
          loader: 'sass-loader',
          options: {outputStyle: 'compressed'}
        }]
      })
    }]
  },

  plugins: plugins,
  externals: externals
};
