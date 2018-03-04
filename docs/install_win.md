# インストール手順 Windows編

対象OS: Windows 10


## 2-4 Node.js のインストール

https://nodejs.org/ja/  から「最新版」をダウンロードしインストール

インストール後コマンドプロンプトでバージョンを確認、バージョン番号はどんどん上がるので一致してなくて良いです

```dos
node -v
```

※ プロンプトは省略しました

## 2-6 インストール用プロジェクトの作成

* プロジェクトの作成

```dos
mkdir hello_react
cd hello_react
npm init -y
```

※ プロンプトは省略しました

* package.jsonの変更

```json
{
  "name": "hello_react",
  "version": "1.0.0",
  "description": "Hello React",
  "private": true,
  "main": "index.js",
  "scripts": {
    "start": "webpack-dev-server",
    "webpack": "webpack -d"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

## 2-7 npmパッケージのインストール

```dos
npm install react react-dom
npm install webpack webpack-cli webpack-dev-server --save-dev
npm install babel-cli babel-loader babel-preset-env babel-preset-react --save-dev
npm install eslint eslint-loader eslint-plugin-react --save-dev
npm install css-loader style-loader babel-loader --save-dev
```

※ プロンプトは省略しました

以下のような警告(warning, WARN)が表示されても問題ありません。

```
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@1.1.2 (node_modules\fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@1.1.2: wanted {"os":"darwin","arch":"any"} (current: {"os":"win32","arch":"x64"})
```



## 2-8 確認用Reactコードの作成

* ディレクター作成

```dos
mkdir src
mkdir public
```
※ プロンプトは省略しました

* .babelrc

```json
{
  "presets": ["env", "react"]
}
```
* .eslintrc.json

```json
{
  "env": {
    "browser": true,
    "es6": true
  },
  "parserOptions": {
    "sourceType": "module",
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "jsx": true
    }
  },
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "plugins": ["react"],
  "rules": {
    "no-console": "off"
  }
}
```
* webpack.config.js

```js
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
```

* public¥index.html

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta http-equiv="X-UA-Compatible" content="IE=Edge, chrome=1" />
  <title>React App</title>
</head>
<body>
  <div id="root"></div>
  <script type="text/javascript" src="js/app.js" charset="utf-8"></script>
</body>
</html>
```

* src￥index.js

```js
import React from 'react'
import ReactDOM from 'react-dom'

ReactDOM.render(
  <h1>Hello, world!!</h1>,
  document.getElementById('root')
)
```

*  確認

```dos
npm start
```

※ プロンプトは省略しました

コマンドプロンプトに `webpack: Compiled successfully.` が表示されたら ブラウザーで  `http://localhost:8080` をアクセス
