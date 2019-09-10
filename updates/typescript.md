# TypeScript

[TypeScript](https://www.typescriptlang.org) は JavaScript(ES6) に型宣言を加えた言語です。マイクロソフトのAnders Hejlsberg等が開発したオープンソースの言語です。  
TypeScript処理系は TypeScript言語で書かれたプログラムをJavaScriptに変換します。

## TypeScriptの利点

### 変数、関数に型が書ける

* 型があると間違った値の代入や引数の間違い等がコンパイル時または VSCode上で判る
* 型はコードを読む人の助けになる
* 適切な型を定義する事で、バグの発生し難いプログラムが書ける

###  JavaScriptから移行が容易

* エラーは出るが通常のJavaScriptもコンパイル出来る
* `any` 型を指定すればJavaScriptのコードがそのままエラー無しでコンパイル出来る
* したがって、徐々に移行して行ける
* 拡張子を `.js` から `.ts` または '.tsx' に変更する (JSXを含む場合は `.tsx`)

## Jyankenの TypeScript版コード

* src/index.tsx

```typescript
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BrowserRouter, Route,  Redirect, Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Jyanken, { Statuses, Score } from './Jyanken'


type JyankeGamePageProps = {
  location: any;
}
type JyankeGamePageState = {
  scores: Score[],
  status: Statuses
}

class JyankeGamePage extends React.Component<JyankeGamePageProps, JyankeGamePageState> {
  jyanken: Jyanken

  constructor(props: JyankeGamePageProps) {
    super(props)
    this.jyanken = new Jyanken()
    this.state = {scores: [], status: {draw: 0, win: 0, lose: 0}}
  }
  componentDidMount() {
    this.getResult()
  }
  getResult() {
    this.setState({scores: this.jyanken.getScores()})
    this.setState({status: this.jyanken.getStatuses()})
  }
  pon(te: number) {
    this.jyanken.pon(te)
    this.getResult()
  }
  render() {
    const tabStyle= {width: 200, height: 50, textAlign: 'center', color: '#fff', backgroundColor: '#01bcd4', borderRadius: 0}
    const activeStyle = (path: string) => Object.assign({borderBottom: `solid 2px ${this.props.location.pathname.match(path) ? '#f00' : '#01bcd4'}`}, tabStyle)
    return (
      <div style={{marginLeft: 30}}>
        <Header>じゃんけん ポン！</Header>
        <JyankenBox actionPon={(te: number) => this.pon(te)} />
        <Paper style={{width: 400}}>
          <Link id="tab-scores" to="/scores" style={{textDecoration: 'none'}}><Button style={activeStyle('scores')}>対戦結果</Button></Link>
          <Link id="tab-status" to="/status" style={{textDecoration: 'none'}}><Button style={activeStyle('status')}>対戦成績</Button></Link>
          <Route path="/scores" component={() => <ScoreList scores={this.state.scores} />}/>
          <Route path="/status" component={() => <StatusBox status={this.state.status} />}/>
          <Route exact path="/" component={() => <Redirect to="/scores" />}/>
        </Paper>
      </div>
    )
  }
}

const Header = (props: {children: any}) => (<h1>{props.children}</h1>)

const StatusBox = (props: {status: Statuses}) => (
  <Table>
    <TableBody>
      <TableRow>
        <TableCell variant="head">勝ち</TableCell><TableCell style={judgmentStyle(1)}>{props.status.win}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell variant="head">負け</TableCell><TableCell style={judgmentStyle(2)}>{props.status.lose}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell variant="head">引き分け</TableCell><TableCell style={judgmentStyle(0)}>{props.status.draw}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
)

const JyankenBox = (props: {actionPon: any}) => {
  const style = {marginLeft: 20}
  return (
    <div style={{marginTop: 40, marginBottom: 30, marginLeft: 50}}>
      <Button variant="contained" id="btn-guu" onClick={() => props.actionPon(0)} style={style}>グー</Button>
      <Button variant="contained" id="btn-choki" onClick={() => props.actionPon(1)} style={style}>チョキ</Button>
      <Button variant="contained" id="btn-paa" onClick={() => props.actionPon(2)} style={style}>パー</Button>
    </div>
  )
}

const ScoreList = (props :{scores: Score[]}) => (
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>時間</TableCell><TableCell>人間</TableCell><TableCell>コンピュータ</TableCell><TableCell>結果</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {props.scores.map((score, ix) => <ScoreListItem key={ix} score={score} />)}
    </TableBody>
  </Table>
)

const ScoreListItem = (props: {score: Score}) => {
  const teString = ["グー","チョキ", "パー"]
  const judgmentString = ["引き分け","勝ち", "負け"]
  const dateHHMMSS = (d:Date) => d.toTimeString().substr(0, 8)
  return (
    <TableRow>
      <TableCell style={judgmentStyle(props.score.judgment)}>{dateHHMMSS(props.score.created_at)}</TableCell>
      <TableCell style={judgmentStyle(props.score.judgment)}>{teString[props.score.human]}</TableCell>
      <TableCell style={judgmentStyle(props.score.judgment)}>{teString[props.score.computer]}</TableCell>
      <TableCell style={judgmentStyle(props.score.judgment)}>{judgmentString[props.score.judgment]}</TableCell>
    </TableRow>
  )
}

const judgmentStyle = (judgment:number) : any => ({paddingRight: "16px", color: ["#000", "#2979FF", "#FF1744"][judgment]})

ReactDOM.render(
  <BrowserRouter>
    <Route path="/" component={JyankeGamePage}/>
  </BrowserRouter>,
  document.getElementById('root')
)
```

* src/Jyanken.ts

```typescript
export interface Score {human: number, computer: number, created_at: Date, judgment: number}
export interface Statuses {draw: number, win: number, lose: number}

export default class Jyanken {

  scores: Score[]
  statuses: number[]

  constructor() {
    this.scores = []
    this.statuses = [0, 0, 0]
  }
  pon(human_hand:number, computer_hand:number = Math.floor(Math.random() * 3)) : void {
    const judgment = (computer_hand - human_hand + 3) % 3
    this.scores.push({human: human_hand, computer: computer_hand, created_at: new Date(), judgment: judgment})
    this.statuses[judgment]++
  }
  getScores() : Score[] {
    return this.scores.slice().reverse()
  }
  getStatuses() : Statuses {
    return {draw: this.statuses[0], win: this.statuses[1], lose: this.statuses[2]}
  }
}
```

