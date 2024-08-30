// webpack.standalone.config.js

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
        use: ['style-loader', 'css-loader', 'postcss-loader'],
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
  ],
};