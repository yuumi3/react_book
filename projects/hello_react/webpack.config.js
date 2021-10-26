module.exports = {
  entry: {
    app: "./src/index.js"
  },
  output: {
    path: __dirname + "/public",
    publicPath: "/js/",
    filename: "js/[name].js"
  },
    devServer: {
    port: 8080
  },
  devtool: "eval-source-map",
  mode: "development",
  module: {
    rules: [{
      test: /\.js$/,
      enforce: "pre",
      exclude: /node_modules/,
      loader: "eslint-loader"
    }, {
      test: /\.css$/,
      use: ["style-loader","css-loader"]
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel-loader"
     }]
  }
};