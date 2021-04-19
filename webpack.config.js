const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

const isDevelopmentMode = process.env.NODE_ENV !== 'production'

module.exports = {
  mode: isDevelopmentMode ? 'development' : 'production',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
  },
  devtool: isDevelopmentMode ? 'eval' : 'nosources-source-map',
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)?$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader' },
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: 'public',
          filter: (resourcePath) => !resourcePath.endsWith('public/index.html'),
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      inject: 'body',
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: isDevelopmentMode ? 'server' : 'static',
      openAnalyzer: false,
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  devServer: {
    host: 'localhost',
    port: '3000',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    historyApiFallback: true,
    contentBase: './dist',
  },
}
