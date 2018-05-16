const autoprefixer = require('autoprefixer');
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const production = process.env.NODE_ENV === 'production';

var plugins = [
  new ExtractTextPlugin('[name].css'),
  new CopyWebpackPlugin([
    {from: 'img', to: 'img'},
  ]),
];
var externals = {};
var optimization = {};

// This is since mini css extract plugin doesn't support hot reloading.
var css = null;

if (production) {
  plugins = plugins.concat([
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.MinChunkSizePlugin({
      minChunkSize: 51200,
    }),
    new webpack.LoaderOptionsPlugin({minimize: true}),
  ]);

  css = [MiniCssExtractPlugin.loader, {
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
  }];

  externals = {
    react: 'React',
    'react-dom': 'ReactDOM',
  };

  optimization ={
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          output: {comments: false},
          compress: {
            warnings: false,
            dead_code: true,
          },
        },
      }),
      new OptimizeCSSAssetsPlugin(),
    ],
  };
} else {
  plugins = plugins.concat([
    new ExtractTextPlugin('[name].css'),
    new webpack.LoaderOptionsPlugin({debug: true}),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ]);

  css = ExtractTextPlugin.extract({
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
    }],
  });
}

module.exports = {
  entry: {
    main: './shared/main.js',
    index: './index.js',
    'cli/index': './cli/index.js',
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
      use: [
        'file-loader?name=[path][name].html',
        'extract-loader',
        'html-loader',
        'pug-html-loader',
      ]
    }, {
      test: /\.scss$/,
      use: css,
    }],
  },

  plugins: plugins,
  externals: externals,
  optimization: optimization
};
