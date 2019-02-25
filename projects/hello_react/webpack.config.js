module.exports = {
  entry: {
    app: "./src/index.js"
  },
  output: {
    path: __dirname + '/public/js',
    filename: "[name].js"
  },
    devServer: {
    contentBase: __dirname + '/public',
    port: 8080,
    publicPath: '/js/'
  },
  devtool: "eval-source-map",
  mode: 'development',
  module: {
    rules: [{
      test: /\.js$/,
      enforce: "pre",
      exclude: /node_modules/,
      loader: "eslint-loader"
    }, {
      test: /\.css$/,
      loader: ["style-loader","css-loader"]
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
     }]
  }
};