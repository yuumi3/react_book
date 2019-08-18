# Redux

jyankenアプリに[Redux](https://github.com/reduxjs/redux)を導入したサンプルコードを作りました。

このページの下部にjyankenアプリ同様に1つのファイルで書いたコードです。また [reduxフォルダー](redux/) にはReduxの標準的なディレクトリー構成でディレクトリー・ファイルを作ったものを置きました。

* jyankenアプリにあった Jyanken.js の機能は Reducer に取り込みました、ただし一部の関数は共通化のために models/Jyanken.js  に置いています
* react-router-dom を Redux で使うために [connected-react-router](https://github.com/supasate/connected-react-router) を使っています
* デバッグしやすいように redux-loggerを組み込んでいるので、ブラウザーのコンソールでstoreの変化がわかります
* 動かすには以下をインストールして下さい
```
npm install redux react-redux redux-logger connected-react-router history
```


#### 1ファイル版 redux jyankenアプリ

```js
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider, connect } from 'react-redux'
import logger from 'redux-logger'
import { Switch, Route,  Redirect, Link } from 'react-router-dom'
import { connectRouter, routerMiddleware, ConnectedRouter } from 'connected-react-router'
import { createBrowserHistory } from 'history'

import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'


// --- Components

const Jyanken = (props) => {
  const tabStyle = {width: 200, height: 50, textAlign: 'center', color: '#fff', backgroundColor: '#01bcd4', borderRadius: 0}
  const activeStyle = (path) => Object.assign({borderBottom: `solid 2px ${props.pathname.match(path) ? '#f00' : '#01bcd4'}`}, tabStyle)
  return (
    <div style={{marginLeft: 30}}>
      <Header>じゃんけん ポン！</Header>
      <JyankenBox actionPon={(te) => props.onClick(te)} />
      <Paper style={{width: 400}} zDepth={2}>
        <Link id="tab-scores" to="/scores" style={{textDecoration: 'none'}}><Button style={activeStyle('scores')}>対戦結果</Button></Link>
        <Link id="tab-status" to="/status" style={{textDecoration: 'none'}}><Button style={activeStyle('status')}>対戦成績</Button></Link>
        <Switch>
          <Route path="/scores" render={() => <ScoreList scores={props.scores} />}/>
          <Route path="/status" render={() => <StatusBox status={props.status} />}/>
          <Route exat path="/" render={() => <Redirect to="/scores" />}/>
        </Switch>
      </Paper>
    </div>
  )
}
Jyanken.propTypes = {
  scores: PropTypes.array,
  status: PropTypes.object,
  onClick: PropTypes.func,
  pathname: PropTypes.string
}

const Header = (props) => (<h1>{props.children}</h1>)
Header.propTypes = {
  children: PropTypes.string
}

const StatusBox = (props) => (
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
StatusBox.propTypes = {
  status: PropTypes.object
}

const JyankenBox = (props) => {
  const style = {marginLeft: 20}
  return (
    <div style={{marginTop: 40, marginBottom: 30, marginLeft: 50}}>
      <Button variant="contained" id="btn-guu" onClick={() => props.actionPon(0)} style={style}>グー</Button>
      <Button variant="contained" id="btn-choki" onClick={() => props.actionPon(1)} style={style}>チョキ</Button>
      <Button variant="contained" id="btn-paa" onClick={() => props.actionPon(2)} style={style}>パー</Button>
    </div>
  )
}
JyankenBox.propTypes = {
  actionPon: PropTypes.func
}

const ScoreList = (props) => (
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
ScoreList.propTypes = {
  scores: PropTypes.array
}

const ScoreListItem = (props) => {
  const teString = ["グー","チョキ", "パー"]
  const judgmentString = ["引き分け","勝ち", "負け"]
  const dateHHMMSS = (d) => d.toTimeString().substr(0, 8)
  return (
    <TableRow>
      <TableCell style={judgmentStyle(props.score.judgment)}>{dateHHMMSS(props.score.created_at)}</TableCell>
      <TableCell style={judgmentStyle(props.score.judgment)}>{teString[props.score.human]}</TableCell>
      <TableCell style={judgmentStyle(props.score.judgment)}>{teString[props.score.computer]}</TableCell>
      <TableCell style={judgmentStyle(props.score.judgment)}>{judgmentString[props.score.judgment]}</TableCell>
    </TableRow>
  )
}
ScoreListItem.propTypes = {
  score: PropTypes.object
}

const judgmentStyle = (judgment) => ({paddingRight: "16px", color: ["#000", "#2979FF", "#FF1744"][judgment]})

// --- Model

const JyankenModel = {
  random_hand: () => Math.floor(Math.random() * 3),
  judgment: (computer, human) => (computer - human + 3) % 3
}

// --- Actions

const jyankenPon = (human) => ({
  type: 'JYANKEN_PON',
  computer: JyankenModel.random_hand(),
  human
})

// --- reducers

const scoreReducer = (state = [], action) => {
  switch (action.type) {
    case 'JYANKEN_PON': {
      const judgment = JyankenModel.judgment(action.computer, action.human)
      return [
        {
          human: action.human,
          computer: action.computer,
          created_at: new Date(),
          judgment: judgment
        },
        ...state
      ]
    }
    default:
      return state
  }
}

const statusReducer = (state = {draw: 0, win: 0, lose: 0}, action) => {
  switch (action.type) {
    case 'JYANKEN_PON': {
      const judgment = JyankenModel.judgment(action.computer, action.human)
      const statusKey = ['draw', 'win', 'lose'][judgment]
      return {
        ...state,
      [statusKey] : state[statusKey] + 1
      }
    }
    default:
      return state
  }
}

const reducers = (history) => combineReducers({
  router: connectRouter(history),
  scoreReducer,
  statusReducer
})

// --- Constants

const JyankeGamePage = connect(
  (state) => ({scores: state.scoreReducer, status: state.statusReducer, pathname: state.router.location.pathname}),
  (dispatch) => ({
    onClick: (te) => dispatch(jyankenPon(te))
  })
)(Jyanken)

// --- Top

export const history = createBrowserHistory()
const store = createStore(
  reducers(history),
  applyMiddleware(
    routerMiddleware(history),
    logger)
)

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <JyankeGamePage/>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)
```
