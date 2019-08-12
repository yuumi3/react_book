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

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import Paper from 'material-ui/Paper';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';


// --- Components

const Jyanken = (props) => {
    const tabStyle = {width: 200, height: 50, textAlign: 'center', color: '#fff', backgroundColor: '#01bcd4'}
    const activeStyle = (path) => Object.assign({borderBottom: `solid 2px ${props.pathname.match(path) ? '#f00' : '#01bcd4'}`}, tabStyle)
    return (
    <MuiThemeProvider>
      <div style={{marginLeft: 30}}>
        <Header>じゃんけん ポン！</Header>
        <JyankenBox actionPon={(te) => props.onClick(te)} />
        <Paper style={{width: 400}} zDepth={2}>
          <Link id="tab-scores" to="/scores"><FlatButton label="対戦結果" style={activeStyle('scores')}/></Link>
          <Link id="tab-status" to="/status"><FlatButton label="対戦成績" style={activeStyle('status')}/></Link>
          <Switch>
            <Route path="/scores" render={() => <ScoreList scores={props.scores} />}/>
            <Route path="/status" render={() => <StatusBox status={props.status} />}/>
            <Route exat path="/" render={() => <Redirect to="/scores" />}/>
          </Switch>
        </Paper>
      </div>
    </MuiThemeProvider>
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
      const judgment = JyankenModel.judgment(computer, human)
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
      const judgment = JyankenModel.judgment(computer, human)
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

// --- Containers

const JyankeGamePage = connect(
  (state) => ({scores: state.scoreReducer, status: state.statusReducer, pathname: state.router.location.pathname}),
  (dispatch) => ({
    onClick: (te) => dispatch(jyankenPon(te))
  })
)(Jyanken)

// --- Store

export const history = createBrowserHistory()
const store = createStore(
  reducers(history),
  applyMiddleware(
    routerMiddleware(history),
    logger)
)

// --- Top

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <JyankeGamePage/>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)
```
