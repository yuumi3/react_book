# 「作りながら学ぶ React 入門」 サポートページ

![](http://www.shuwasystem.co.jp/products/7980img/5075/a.jpg)

## 開発環境の構築

* [インストール手順 Mac](docs/install_mac.md)
* [インストール手順 Windows](docs/install_win.md)

## コード

* [JSXの基本](sources/jsx.md)
* [コンポーネント](sources/component.md)
* [コンポーネントの応用](sources/application.md)
* [テスティング](sources/test.md)

## お知らせ

* React 16.4.1 (2018-06-25日の最新のnode.js, npm)でコードが動作することを確認しました。
* React 16.3.1 (2018-04-05日の最新のnode.js, npm)でコードが動作することを確認しました。
* @tetsuroshimura さんの指摘により webpack4 でのエラー、警告に対応しました。インストール手順と webpack.config.js が変更されました。
* @mktakuya さんの発見された間違いを正誤表に追加しました、React 16.2.0 (2018-01-09日の最新npm)でコードが動作することを確認しました。
* E2Eテストが終了しない問題が解決しました  [package.jsonを変更して下さい](https://github.com/yuumi3/react_book/commit/9a8a52eeaadf2fb0638994d086f4e88c6ed4c769)
* React 16.1.1 (2017-11-15日の最新npm)でコードが動作することを確認しました。
* Mocha 4.0.0 でワーニングが発生する問題に対応しました [package.jsonを変更して下さい](https://github.com/yuumi3/react_book/commit/de08b474d6b36f4b5ea0efb5c51d7371fe6ea004#diff-78e5c674b259d266893065c89276971e)


## 質問


質問などがありましたら、気軽に [Issues](https://github.com/yuumi3/react_book/issues) に書いて下さい


## 表正誤

| ページ | 誤            | 正            |
| ----- |-------------|------------|
| 30  | `npm install css-loader style-loader babel-loader --save-dev` | `npm install css-loader style-loader --save-dev` |
| 115 | scoreというパラメーターが渡って来ます。| human, computer, judgmentというパラメーターが渡って来ます。 |
| 103 | `<img src=""logo.png"" ... />` | `<img src="logo.png" ... />`   (3か所あります) |
| 200 | test/index.js | このサポートページの test/index.js に置き換えて下さい |


## リンク

* [書籍内リンク](sources/links.md)
* [出版元・秀和システムのページ](http://www.shuwasystem.co.jp/products/7980html/5075.html)
* [Amazon(作りながら学ぶ React 入門)](https://www.amazon.co.jp/dp/479805075X)
* [著者ブログ(yuumi3のお仕事日記)](http://yuumi3.hatenablog.com/entry/2017/09/15/223623)
