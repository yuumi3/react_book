# コンポーネントの応用

### 7-1-1 Material-UI

JSXの基本で作った jyanken を改造


* インストール手順

```shell
npm install material-ui
```
※ プロンプトは省略しました

* src/Jyanken.js の追加

```js
export default class Jyanken {
  constructor() {
    this.scores = []
    this.statuses = [0, 0, 0]
  }
  pon(human_hand) {
    const computer_hand = Math.floor(Math.random() * 3)
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
* src/index.js

```js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RaisedButton from 'material-ui/RaisedButton'
import Paper from 'material-ui/Paper';
import { Tabs, Tab } from 'material-ui/Tabs'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import Jyanken from './Jyanken'

class JyankeGamePage extends Component {
  constructor(props) {
    super(props)
    this.jyanken = new Jyanken()
    this.state = {scores: [], status: {}, tabIndex: 0}
  }
  componentDidMount() {
    this.getResult()
  }
  tabChange(ix) {
    this.setState({tabIndex: ix})
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
    return (
      <MuiThemeProvider>
        <div style={{marginLeft: 30}}>
          <Header>じゃんけん ポン！</Header>
          <JyankenBox actionPon={(te) => this.pon(te)} />
          <Paper style={{width: 400}} zDepth={2}>
            <Tabs value={this.state.tabIndex} onChange={(ix) => this.tabChange(ix)}>
              <Tab label="対戦結果" value={0}>
                <ScoreList scores={this.state.scores} />
              </Tab>
              <Tab label="対戦成績" value={1}>
                <StatusBox status={this.state.status} />
              </Tab>
            </Tabs>
          </Paper>
        </div>
      </MuiThemeProvider>
    )
  }
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
      <RaisedButton label="グー" onClick={() => props.actionPon(0)} style={style} />
      <RaisedButton label="チョキ" onClick={() => props.actionPon(1)} style={style} />
      <RaisedButton label="パー" onClick={() => props.actionPon(2)} style={style} />
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
  <JyankeGamePage />,
  document.getElementById('root')
)
```

* src/index.css ファイルは削除してもよいです

## 7-2-1 React Router

* インストール手順

```shell
npm install react-router-dom
```

※ プロンプトは省略しました

* package.josn ファイルの変更

```json
{
  "name": "jyanken",
  "version": "1.2.0",
  "description": "Jyanken",
  "private": true,
  "main": "index.js",
  "scripts": {
    "start": "webpack-dev-server --history-api-fallback",
    "webpack": "webpack -d"
  },

  以下は同じ(変更しない)

}
```

* src/index.js

```js
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
            <Link to="/scores"><FlatButton label="対戦結果" style={activeStyle('scores')}/></Link>
            <Link to="/status"><FlatButton label="対戦成績" style={activeStyle('status')}/></Link>

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
      <RaisedButton label="グー" onClick={() => props.actionPon(0)} style={style} />
      <RaisedButton label="チョキ" onClick={() => props.actionPon(1)} style={style} />
      <RaisedButton label="パー" onClick={() => props.actionPon(2)} style={style} />
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

## サーバーとの通信

### 7-3-2 プログラム作成

* Mac: hello_reactプロジェクトをコピーしてweatherプロジェクトを作る

```shell
mkdir weather
cd weather
mkdir src public
cp ../hello_react/{.b*,.e*,pa*,w*} .
cp ../hello_react/public/index.html public
npm install
```

※ プロンプトは省略しました

* Windows: hello_reactプロジェクトをコピーしてweatherプロジェクトを作る

```dos
mkdir weather
cd weather
mkdir src public
xcopy ..\hello_react . /c /h
copy ..\hello_react\public\index.html public
npm install
```
※ プロンプトは省略しました

* NPMインストール

```shell
npm install material-ui
```
※ プロンプトは省略しました

* src/index.js

```js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card'
import { List, ListItem } from 'material-ui/List'
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import RefreshIndicator from 'material-ui/RefreshIndicator'
import WeatherIcon from 'material-ui/svg-icons/image/wb-sunny'
import TemperatureIcon from 'material-ui/svg-icons/editor/show-chart'

class WeatherPage extends Component {
  constructor(props) {
    super(props)
    this.state = {placeName: null, weather: null, temperature: null, loading: false}
    //
    this.Places = [{name: '札幌', id: 2128295}, {name: '東京', id: 1850147},
                   {name: '大阪', id: 1853909}, {name: '沖縄', id: 1894616}]
    this.OpenWeatherMapKey = "＊＊ ここに取得したAPIキーを書いて下さい ＊＊"
  }
  selectPlace(index) {
    if (index > 0) {
      const place = this.Places[index - 1]
      this.setState({placeName: place.name, weather: null, temperature: null, loading: true})
      this.getWeather(place.id)
    }
  }
  getWeather(id) {
    const delay = (mSec) => new Promise((resolve) => setTimeout(resolve, mSec))

    fetch(`http://api.openweathermap.org/data/2.5/weather?appid=${this.OpenWeatherMapKey}&id=${
          id}&lang=ja&units=metric`)
    .then((response) => response.json())
    .then((json) => {
      delay(700)
      .then(() => this.setState({weather: json.weather[0].description,
                                 temperature: json.main.temp, loading: false}))
    })
    .catch((response) => {
      this.setState({loading: false})
      console.log('** error **', response)
    })
  }
  render() {
    return (
      <MuiThemeProvider>
        <Card style={{margin: 30}}>
          <CardHeader title={<Title place={this.state.placeName} />} />
          <CardText style={{position: 'relative'}}>
            <RefreshIndicator status={this.state.loading ? 'loading' : 'hide'} top={40} left={100} loadingColor="#f00" />
            <WeaterInfomation weather={this.state.weather} temperature={this.state.temperature} />
          </CardText>
          <CardActions>
            <PlaceSelector places={this.Places} actionSelect={(ix) => this.selectPlace(ix)} />
          </CardActions>
        </Card>
      </MuiThemeProvider>
    )
  }
}


const Title = (props) => (
  <h1>{props.place ? props.place + 'の天気' : '天気情報'}</h1>
)
Title.propTypes = {
  place: PropTypes.string
}

const WeaterInfomation = (props) => (
  <List>
    <ListItem leftIcon={<WeatherIcon/>} primaryText={props.weather} />
    <ListItem leftIcon={<TemperatureIcon />} primaryText={props.temperature ? `${props.temperature} ℃` : ''} />
  </List>
)
WeaterInfomation.propTypes = {
  weather: PropTypes.string,
  temperature: PropTypes.number
}

const PlaceSelector = (props) => (
  <DropDownMenu value={-1} onChange={(event, index) => props.actionSelect(index)}>
    <MenuItem value={-1} primaryText="場所を選択" />
    {props.places.map((place, ix) => <MenuItem key={ix} value={ix} primaryText={place.name} />)}
  </DropDownMenu>
)
PlaceSelector.propTypes = {
  places: PropTypes.array,
  actionSelect: PropTypes.func
}

ReactDOM.render(
  <WeatherPage />,
  document.getElementById('root')
)
```

