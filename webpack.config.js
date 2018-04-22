const autoprefixer = require('autoprefixer');
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestRevisionPlugin = require('manifest-revision-webpack-plugin');

const production = process.env.NODE_ENV === 'production';

var plugins = null;
var externals = {};

if (production) {
  plugins = [
    new CopyWebpackPlugin([
        {from: 'img', to: 'img'},
        {from: 'vendor', to: 'vendor/[name].[hash:3].[ext]'},
    ]),
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
    new ExtractTextPlugin('[name].[contenthash].css'),
    new ManifestRevisionPlugin('tldr/static/manifest.json', {
      rootAssetPath: './tldr/static',
    }),
  ];

  externals = {
    react: 'React',
    'react-dom': 'ReactDOM',
  };
} else {
  plugins = [
    new CopyWebpackPlugin([
        {from: 'img', to: 'img'},
        {from: 'vendor', to: 'vendor/[name].[ext]'},
    ]),
    new webpack.LoaderOptionsPlugin({debug: true}),
    new ExtractTextPlugin('[name].css'),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ];
}

module.exports = {
  entry: {
    content: './js/content.js',
    home: './js/home.js',
    main: './js/main.js',
  },

  output: {
    path: path.resolve(__dirname, 'docs'),
    publicPath: '/static',
    filename: production ? '[name].[chunkhash].js' : '[name].js'
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
