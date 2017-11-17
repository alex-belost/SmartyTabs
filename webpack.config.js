const webpack = require('webpack');
const resolve = require('path').resolve;
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: resolve(__dirname, 'main'),

  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'dist'),
    publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: resolve(__dirname, 'src/js'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                'es2015',
                'env',
              ],
              plugins: [ 'transform-runtime' ],
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        include: resolve(__dirname, 'src/stylesheet'),
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [
                  require('autoprefixer')(),
                ];
              },
            },
          },
          'sass-loader',
        ],
      },
    ],
  },

  resolve: {
    alias: {
      '@js': resolve(__dirname, 'src/js'),
    },
  },

  plugins: [
    new HtmlWebpackPlugin({
      cache: true,
      inject: 'body',
      template: 'index.html',
    }),
  ],

  devServer: {
    host: 'localhost',
    port: 8800,
  },
};
