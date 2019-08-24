# テスティング

## 8-2 ユニットテスト

JSXの基本、コンポーネントで作った jyanken を改造

* インストール手順

```shell
npm install mocha --save-dev
npm install @babel/register --save-dev
mkdir test
```

※ プロンプトは省略しました

* package.jsonにテストを追加

```json
{
  "name": "hello_react",
  "version": "1.0.0",
  "description": "Hello React",
  "private": true,
  "main": "index.js",
  "scripts": {
    "start": "webpack-dev-server --history-api-fallback",
    "webpack": "webpack -d",
    "test": "mocha --require @babel/register --exit --timeout 5000"
  },
```

* src/Jyanken.js の変更

```js
export default class Jyanken {
  constructor() {
    this.scores = []
    this.statuses = [0, 0, 0]
  }
  pon(human_hand, computer_hand = Math.floor(Math.random() * 3)) {
    const judgment = (computer_hand - human_hand + 3) % 3
    this.scores.push({human: human_hand, computer: computer_hand, created_at: new Date(), judgment: judgment})
    this.statuses[judgment]++
  }
  getScores() {
    return this.scores.slice().reverse()
  }
  getStatuses() {
    return {draw: this.statuses[0], win: this.statuses[1], lose: this.statuses[2]}
  }
}
```

* test/Jyanke.js

```js
import assert  from 'assert'
import Jyanken from '../src/Jyanken'


describe('Jyanken', () => {
  const jyanken = new Jyanken()

  describe('勝敗の判定が正しいか', () => {
    describe('コンピュターがグーの場合', () => {
      it ('人間がグーなら引き分け', () => {
        jyanken.pon(0, 0)
        assert.equal(jyanken.getScores()[0].judgment, 0)
      })
      it ('人間がチョキなら負け', () => {
        jyanken.pon(1, 0)
        assert.equal(jyanken.getScores()[0].judgment, 2)
      })
      it ('人間がパーなら勝ち', () => {
        jyanken.pon(2, 0)
        assert.equal(jyanken.getScores()[0].judgment, 1)
      })
    })

    describe('コンピュターがチョキの場合', () => {
      it ('人間がグーなら勝ち', () => {
        jyanken.pon(0, 1)
        assert.equal(jyanken.getScores()[0].judgment, 1)
      })
      it ('人間がチョキなら引き分け', () => {
        jyanken.pon(1, 1)
        assert.equal(jyanken.getScores()[0].judgment, 0)
      })
      it ('人間がパーなら負け', () => {
        jyanken.pon(2, 1)
        assert.equal(jyanken.getScores()[0].judgment, 2)
      })
    })

    describe('コンピュターがパーの場合', () => {
      it ('人間がグーなら負け', () => {
        jyanken.pon(0, 2)
        assert.equal(jyanken.getScores()[0].judgment, 2)
      })
      it ('人間がチョキなら勝ち', () => {
        jyanken.pon(1, 2)
        assert.equal(jyanken.getScores()[0].judgment, 1)
      })
      it ('人間がパーなら引き分け', () => {
        jyanken.pon(2, 2)
        assert.equal(jyanken.getScores()[0].judgment, 0)
      })
    })
  })
})
```
* テストの実行

```shell
npm test
```

※ プロンプトは省略しました

## 8-3 E2Eテスト

```shell
npm install nightmare --save-dev
```

※ プロンプトは省略しました

### 8-3-2 テストコードの書き方

* test/test2.js

```js
import Nightmare from 'nightmare'
import assert  from 'assert'

describe('じゃんけんアプリ', () => {
  const nightmare = Nightmare({ show: false })

  it('アクセスすると「じゃんけん ポン！」と表示されている', (done) => {
    nightmare
    .goto('http://localhost:8080/')
    .evaluate(() => {
      return document.querySelector('h1').innerText
    })
    .then((title) => {
      assert.equal(title, 'じゃんけん ポン！')
      done()
    })
  })
})
```

### 8-3-3 テストコード


* test/helper.js

~~~js
import Nightmare from 'nightmare'

Nightmare.action('getTexts', function(selector, done) {
  this.evaluate_now((selector) => {
    return [].slice.call(document.querySelectorAll(selector)).map((e) => e.innerText)
  }, done, selector)
})

export const touchTap = (selector) => {
  return (nightmare) => {
    nightmare
    .mousedown(selector)
    .mouseup(selector)
  }
}
~~~

* test/index.js

~~~js
import Nightmare from 'nightmare'
import assert  from 'assert'


describe('じゃんけんアプリ', () => {
  const nightmare = Nightmare({ show: false })
  const URL = 'http://localhost:8080/'

  it('グーをクリックすると対戦が行われ、対戦結果が表示される', (done) => {
    nightmare
    .goto(URL)
    .click('#btn-guu')
    .getTexts('tbody td')
    .then((texts) => {
      const [time, human, computer, judgment] = texts
      assert.equal(human, 'グー')
      assert.ok(computer.match(/^(グー|チョキ|パー)$/))
      assert.ok(judgment.match(/^(勝ち|引き分け|負け)$/))
      done()
    })
  })

  it('グーをクリックした後に対戦成績をクリックすると、対戦成績が表示される', (done) => {
    nightmare
    .goto(URL)
    .click('#btn-guu')
    .click('#tab-status')
    .getTexts('tbody td:nth-child(2n)')
    .then((texts) => {
      const [win, lose, draw] = texts.map((e) => Number(e))
      assert.ok(win >= 0 && win <= 1)
      assert.ok(lose >= 0 && lose <= 1)
      assert.ok(draw >= 0 && draw <= 1)
      assert.equal(win + lose + draw, 1)
      done()
    })
  })

  it('2回クリックすると、対戦結果が2行表示される', (done) => {
    nightmare
    .goto(URL)
    .click('#btn-guu')
    .click('#btn-guu')
    .getTexts('tbody tr')
    .then((texts) => {
      assert.equal(texts.length, 2)
      done()
    })
  })

})
~~~


