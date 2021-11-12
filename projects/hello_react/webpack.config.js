const ESLintPlugin = require('eslint-webpack-plugin')
module.exports = {
  entry: {
    app: "./src/index.js"
  },
  output: {
    path: __dirname + "/public/js",
    publicPath: "/js/",
    filename: "[name].js"
  },
  devServer: {
    port: 8080
  },
  devtool: "eval-source-map",
  mode: "development",
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: ['babel-loader']
    }, {
      test: /\.css$/,
      use: ["style-loader","css-loader"]
    }]
  },
  plugins: [
    new ESLintPlugin()
  ]
};