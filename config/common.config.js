const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const config  = require('../src/config.json')

module.exports = {

  entry: './src/app.js',

  output: {
    filename: 'js/app.js',
    path: path.resolve(__dirname, '../build'),
    publicPath: config.publicPath
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../public'),
    },
  },

  module: {
    rules: [

      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
          'postcss-loader'
        ]
      },

      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },

      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },

      {
        test: /\.(glsl|frag|vert)$/,
        exclude: /node_modules/,
        use: [
          'raw-loader',
          'glslify-loader'
        ]
      },

      {
        test: /\.(glb|gltf)$/,
        exclude: /node_modules/,
        use: [
          'raw-loader'
        ]
      },

      {
        test: /\.(png|jpg|gif)$/i,
        type: 'asset'
      }
      
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      publicPath: config.publicPath,
      title: config.title,
      scriptLoading: 'defer',
      template: 'src/index.html',
      minify: false,
      'inject': 'body'
    }),
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        { from: 'public', to: './' }
      ],
    })
  ],
  

}