# 「作りながら学ぶ React 入門」 サポートページ

![React install](https://github.com/yuumi3/react_book/workflows/React%20install/badge.svg)


![](./images/ReactBook.png)

## 開発環境の構築

* [インストール手順 Mac](docs/install_mac.md)
* [インストール手順 Windows](docs/install_win.md)

## コード

* [JSXの基本](sources/jsx.md)
* [コンポーネント](sources/component.md)
* [コンポーネントの応用](sources/application.md)
* [テスティング](sources/test.md)

## お知らせ
* **新機能・機能変更** に「Selenium WebDriverを使ったE2Eテスト」を追加しました
* Material-UI v4.x に対応しました (書籍の中で使っていた Material-UI v0.x が depreciated になったので)
* React 16以降で追加された機能・変更された機能に付いて **新機能・機能変更** に書いて行きます
* React 16.8.6 (2019-07-17日の最新のnode.js, npm)でコードが動作することを確認しました。
* React 16.8.5 (2019-03-27日の最新のnode.js, npm)でコードが動作することを確認しました。
* `npx eslint`, `npx babel`が動作しない問題に対応しました @skytomo221 さん報告ありがとうざいます。
* React 16.8.3 (2019-02-22日の最新のnode.js, npm)でコードが動作することを確認しました。
* 最新の環境(2018-11-18日の最新のnode.js, npm)でESLintがエラーになる件で [テストのインストール手順](https://github.com/yuumi3/react_book/blob/master/sources/test.md)を変更しました。@tomita-yoshihiko さんありがとうございます。
* インストール手順ページのタイプミスを修正しました。@tomoyakuroda さんありがとうございます。
* [テストのインストール手順](https://github.com/yuumi3/react_book/blob/master/sources/test.md) が間違っていたので修正しました。 @akito-38 さん指摘ありがとうございます。


## 質問


質問などがありましたら、気軽に [Issues](https://github.com/yuumi3/react_book/issues) に書いて下さい


## 表正誤

| ページ | 誤            | 正            |
| ----- |-------------|------------|
| 30  | `npm install css-loader style-loader babel-loader --save-dev` | `npm install css-loader style-loader --save-dev` |
| 115 | scoreというパラメーターが渡って来ます。| human, computer, judgmentというパラメーターが渡って来ます。 |
| 103 | `<img src=""logo.png"" ... />` | `<img src="logo.png" ... />`   (3か所あります) |
| 200 | test/index.js | このサポートページの test/index.js に置き換えて下さい |
| 120 | サンプルコードを含め本書のいたるところで **JyankeGamePage** と書かれています |本来は **JyankenGamePage** が正しいのですのですがJyankeGamePageと読み替えて下さい |


## 新機能・機能変更

Reactに新規に追加された機能や大きく変わった部分に付いてもメモです

* [Hooks (useState, useEffect)](updates/hooks1.md)
* [ライフサイクルメソッドの変更](updates/lifecycle.md)
* [Redux](updates/redux.md)
* [TypeScript](updates/typescript.md)
* [Selenium WebDriverを使ったE2Eテスト](updates/selenium_webdriver.md)

## リンク

* [書籍内リンク](sources/links.md)
* [出版元・秀和システムのページ](http://www.shuwasystem.co.jp/products/7980html/5075.html)
* [Amazon(作りながら学ぶ React 入門)](https://www.amazon.co.jp/dp/479805075X)
* [著者ブログ(EY Office)](https://www.ey-office.com/category/React/)
