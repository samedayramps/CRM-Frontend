const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/StandaloneFormWrapper.tsx',
  mode: 'production',
  output: {
    filename: 'standalone-form.js',
    path: path.resolve(__dirname, 'standalone-build'),
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/standalone.html',
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'styles.css',
    }),
    new webpack.DefinePlugin({
        'process.env.REACT_APP_API_URL': JSON.stringify('https://samedayramps-016e8e090b17.herokuapp.com'),
        // Add other environment variables here
      }),
  ],
};