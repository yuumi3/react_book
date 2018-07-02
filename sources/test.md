# テスティング

## 8-2 ユニットテスト

JSXの基本、コンポーネントで作った jyanken を改造

* インストール手順

```shell
npm install mocha --save-dev
npm install babel-register --save-dev
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
    "test": "mocha --require babel-register --exit --timeout 5000"
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

* index.js の変更

```index.js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { BrowserRouter, Route,  Redirect, Link } from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import Paper from 'material-ui/Paper';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import Jyanken from './Jyanken'


class JyankeGamePage extends Component {
  constructor(props) {
    super(props)
    this.jyanken = new Jyanken()
    this.state = {scores: [], status: {}}
  }
  componentDidMount() {
    this.getResult()
  }
  getResult() {
    this.setState({scores: this.jyanken.getScores()})
    this.setState({status: this.jyanken.getStatuses()})
  }
  pon(te) {
    this.jyanken.pon(te)
    this.getResult()
  }
  render() {
    const tabStyle= {width: 200, height: 50, textAlign: 'center', color: '#fff', backgroundColor: '#01bcd4'}
    const activeStyle = (path) => Object.assign({borderBottom: `solid 2px ${this.props.location.pathname.match(path) ? '#f00' : '#01bcd4'}`}, tabStyle)
    return (
      <MuiThemeProvider>
        <div style={{marginLeft: 30}}>
          <Header>じゃんけん ポン！</Header>
          <JyankenBox actionPon={(te) => this.pon(te)} />
          <Paper style={{width: 400}} zDepth={2}>
            <Link id="tab-scores" to="/scores"><FlatButton label="対戦結果" style={activeStyle('scores')}/></Link>
            <Link id="tab-status" to="/status"><FlatButton label="対戦成績" style={activeStyle('status')}/></Link>

            <Route path="/scores" component={() => <ScoreList scores={this.state.scores} />}/>
            <Route path="/status" component={() => <StatusBox status={this.state.status} />}/>
            <Route exact path="/" component={() => <Redirect to="/scores" />}/>
          </Paper>
        </div>
      </MuiThemeProvider>
    )
  }
}
JyankeGamePage.propTypes = {
  location: PropTypes.object
}

const Header = (props) => (<h1>{props.children}</h1>)
Header.propTypes = {
  children: PropTypes.string
}

const StatusBox = (props) => (
  <Table>
    <TableBody displayRowCheckbox={false}>
      <TableRow displayBorder={false}>
        <TableHeaderColumn>勝ち</TableHeaderColumn><TableRowColumn style={judgmentStyle(1)}>{props.status.win}</TableRowColumn>
      </TableRow>
      <TableRow displayBorder={false}>
        <TableHeaderColumn>負け</TableHeaderColumn><TableRowColumn style={judgmentStyle(2)}>{props.status.lose}</TableRowColumn>
      </TableRow>
      <TableRow displayBorder={false}>
        <TableHeaderColumn>引き分け</TableHeaderColumn><TableRowColumn style={judgmentStyle(0)}>{props.status.draw}</TableRowColumn>
      </TableRow>
    </TableBody>
  </Table>
)
StatusBox.propTypes = {
  status: PropTypes.object
}

const JyankenBox = (props) => {
  const style = {marginLeft: 20}
  return (
    <div style={{marginTop: 40, marginBottom: 30, marginLeft: 30}}>
      <RaisedButton id="btn-guu"   label="グー" onClick={() => props.actionPon(0)} style={style} />
      <RaisedButton id="btn-choki" label="チョキ" onClick={() => props.actionPon(1)} style={style} />
      <RaisedButton id="btn-paa"  label="パー" onClick={() => props.actionPon(2)} style={style} />
    </div>
  )
}
JyankenBox.propTypes = {
  actionPon: PropTypes.func
}

const ScoreList = (props) => (
  <Table>
    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
      <TableRow>
        <TableHeaderColumn>時間</TableHeaderColumn><TableHeaderColumn>人間</TableHeaderColumn><TableHeaderColumn>コンピュータ</TableHeaderColumn><TableHeaderColumn>結果</TableHeaderColumn>
      </TableRow>
    </TableHeader>
    <TableBody>
      {props.scores.map((score, ix) => <ScoreListItem key={ix} score={score} />)}
    </TableBody>
  </Table>
)
ScoreList.propTypes = {
  scores: PropTypes.array
}

const ScoreListItem = (props) => {
  const teString = ["グー","チョキ", "パー"]
  const judgmentString = ["引き分け","勝ち", "負け"]
  const dateHHMMSS = (d) => d.toTimeString().substr(0, 8)
  return (
    <TableRow style={judgmentStyle(props.score.judgment)}>
      <TableRowColumn>{dateHHMMSS(props.score.created_at)}</TableRowColumn>
      <TableRowColumn>{teString[props.score.human]}</TableRowColumn>
      <TableRowColumn>{teString[props.score.computer]}</TableRowColumn>
      <TableRowColumn>{judgmentString[props.score.judgment]}</TableRowColumn>
    </TableRow>
  )
}
ScoreListItem.propTypes = {
  score: PropTypes.object
}

const judgmentStyle = (judgment) => ({color: ["#000", "#2979FF", "#FF1744"][judgment]})

ReactDOM.render(
  <BrowserRouter>
    <Route path="/" component={JyankeGamePage}/>
  </BrowserRouter>,
  document.getElementById('root')
)
```

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
    .getTexts('tbody td')
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


