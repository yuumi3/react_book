# Selenium WebDriverを使ったE2Eテスト

jyankenアプリに Selenium WebDriverを使ったE2Eテストのサンプルコードを作りました。

## 環境構築

#### elenium-webdriver のインストール

```shell
npm install selenium-webdriver --save-dev
```

#### ChromeDriver のインストール

1. 自分のPC/MacにインストールされているChromeブラウザーのバージョンを調べる(最新のバージョンへの更新をお勧めします)
2. [ChromeDriver - WebDriver for Chrome](https://chromedriver.chromium.org/downloads) ページにあるChromeブラウザーのバージョンに対応するページに移動
3. Windowsなら **chromedriver_win32.zip** 、 Macなら **chromedriver_mac64.zip** をダウンロードし zipファイルを展開
4. jyanken プロジェクトのディレクトリーに drivers フォルダーを作成し( `mkdir drivers` )、そこに展開された chromedriver.exe / chromedriver をコピー

## 設定ファイルの変更

* .babelrc を変更
    * async/await を使うため

```json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": { "browsers": ["last 2 chrome versions"] }
    }],
    "@babel/preset-react"
    ]
}
```

## テストコード

#### test/test2.js

```js
import { Builder, By } from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome'
import assert from 'assert'

let driver
describe('じゃんけんアプリ', () => {
  before(() => {
    driver = new Builder().forBrowser("chrome").  // ①
      setChromeOptions(new chrome.Options().headless()).  // ②
      setChromeService(new chrome.ServiceBuilder(__dirname + "../drivers/chromedriver")). // ③
      build()
    driver.find = function(selector) { return this.findElement(By.css(selector)) }  // ④
    process.on("unhandledRejection", console.dir)
  })
  after(() => driver.quit())


  it('アクセスすると「じゃんけん ポン！」と表示されている', async () => {  // ⑤
    await driver.get('http://localhost:8080/')  // ⑥
    const title = await driver.find("h1").getText() // ⑦
    assert.equal(title, 'じゃんけん ポン！')
  })
})
```

解説

* before() : テストの開始時の処理の中で
    * ① Chromeのselenium-webdriverインスタンスを作成しています
        * ② そこで、ヘッドレス(ブラウザー画面を表示しない)設定し
        * ③ chromedriver.exe のパスを指定しています
    * ④ elenium-webdriverインスタンスに find() メソッドを定義しています
        * `findElement()` ---指定されたHTML要素を1つ取得する関数
        * `By.css()` --- CSSセレクター指定の関数
        * ここではthisで driverインスタンスをアクセス出来るように **function** を使っています
* ⑤ itに渡す関数は await を使うので async を指定します
* ⑥ `http://localhost:8080/` ページをアクセス(GET)します
* ⑦ `h1` タグを見つけ、h1タグ内の文字列を取得します


#### test/index.js

```js
import { Builder, By } from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome'
import assert from 'assert'

let driver

describe('じゃんけんアプリ', () => {
  const URL = 'http://localhost:8080/'
  before(() => {
    driver = new Builder().forBrowser("chrome").
      setChromeOptions(new chrome.Options().headless()).
      setChromeService(new chrome.ServiceBuilder(__dirname + "../drivers/chromedriver")).
      build()
    driver.find = function(selector) { return this.findElement(By.css(selector)) }
    driver.findAll = function(selector) { return this.findElements(By.css(selector)) }
    process.on("unhandledRejection", console.dir)
  })
  after(() => driver.quit())

  it('グーをクリックすると対戦が行われ、対戦結果が表示される', async () => {
    await driver.get(URL)
    await driver.find("#btn-guu").click()
    const elems = await driver.findAll("tbody td")
    const human = await elems[1].getText()
    const computer = await elems[2].getText()
    const judgment = await elems[3].getText()
    assert.equal(human, 'グー')
    assert.ok(computer.match(/^(グー|チョキ|パー)$/))
    assert.ok(judgment.match(/^(勝ち|引き分け|負け)$/))
  })

  it('グーをクリックした後に対戦成績をクリックすると、対戦成績が表示される', async () => {
    await driver.get(URL)
    await driver.find("#btn-guu").click()
    await driver.find("#tab-status").click()
    const elems = await driver.findAll("tbody td:nth-child(2n)")
    const win  = Number(await elems[0].getText())
    const lose = Number(await elems[1].getText())
    const draw = Number(await elems[2].getText())
    assert.ok(win >= 0 && win <= 1)
    assert.ok(lose >= 0 && lose <= 1)
    assert.ok(draw >= 0 && draw <= 1)
    assert.equal(win + lose + draw, 1)
  })

  it('2回クリックすると、対戦結果が2行表示される', async () => {
    await driver.get(URL)
    await driver.find("#btn-guu").click()
    await driver.find("#btn-guu").click()
    const elems = await driver.findElements(By.css("tbody tr"))
    assert.equal(elems.length, 2)
  })
})
```

コードの解説は、上の test/test2.js と書籍の199,200ページを参考にして下さい。
