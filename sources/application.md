# コンポーネントの応用

### 7-1-1 Material-UI

JSXの基本で作った jyanken を改造


* インストール手順

```shell
npm install @material-ui/core
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
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
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
    const tabStyle = {width: 200, height: 50, color: '#fff', backgroundColor: '#01bcd4'}
    return (
        <div style={{marginLeft: 30}}>
          <Header>じゃんけん ポン！</Header>
          <JyankenBox actionPon={(te) => this.pon(te)} />
          <Paper style={{width: 400}}>
            <Tabs value={this.state.tabIndex} onChange={(event, ix) => this.tabChange(ix)}>
              <Tab label="対戦結果" value={0} style={tabStyle}/>
              <Tab label="対戦成績" value={1} style={tabStyle} />
            </Tabs>
            { this.state.tabIndex == 0 ? <ScoreList scores={this.state.scores} /> : null}
            { this.state.tabIndex == 1 ? <StatusBox status={this.state.status} /> : null}
          </Paper>
        </div>
    )
  }
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

const judgmentStyle = (judgment) => ({paddingRight: 16, color: ["#000", "#2979FF", "#FF1744"][judgment]})

ReactDOM.render(
  <JyankeGamePage/>,
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
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
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
    const tabStyle= {width: 200, height: 50, textAlign: 'center', color: '#fff', backgroundColor: '#01bcd4', borderRadius: 0}
    const activeStyle = (path) => Object.assign({borderBottom: `solid 2px ${this.props.location.pathname.match(path) ? '#f00' : '#01bcd4'}`}, tabStyle)
    return (
      <div style={{marginLeft: 30}}>
        <Header>じゃんけん ポン！</Header>
        <JyankenBox actionPon={(te) => this.pon(te)} />
        <Paper style={{width: 400}} zDepth={2}>
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
JyankeGamePage.propTypes = {
  location: PropTypes.object
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

const judgmentStyle = (judgment) => ({paddingRight: 16, color: ["#000", "#2979FF", "#FF1744"][judgment]})

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
npm install @material-ui/core
npm install @material-ui/icons
```
※ プロンプトは省略しました

* src/index.js

```js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import CircularProgress from '@material-ui/core/CircularProgress'
import WeatherIcon from '@material-ui/icons/WbSunny'
import TemperatureIcon from '@material-ui/icons/ShowChart'

class WeatherPage extends Component {
  constructor(props) {
    super(props)
    this.state = {placeIndex: null, weather: null, temperature: null, loading: false}
    //
    this.Places = [{name: '札幌', id: 2128295}, {name: '東京', id: 1850147},
                   {name: '大阪', id: 1853909}, {name: '沖縄', id: 1894616}]
    this.OpenWeatherMapKey = "＊＊ ここに取得したAPIキーを書いて下さい ＊＊"
  }
  selectPlace(index) {
    const place = this.Places[index]
    this.setState({placeIndex: index, weather: null, temperature: null, loading: true})
    this.getWeather(place.id)
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
    const placeName = this.state.placeIndex === null ? "" : this.Places[this.state.placeIndex].name
    return (
      <Card style={{margin: 30}}>
        <CardHeader title={<Title placeName={placeName} />} />
        <CardContent style={{position: 'relative'}}>
          {this.state.loading ? <CircularProgress style={{position: "absolute", top:40, left: 100}} /> : null}
          <WeaterInfomation weather={this.state.weather} temperature={this.state.temperature} />
        </CardContent>
        <CardActions>
          <PlaceSelector places={this.Places} placeIndex={this.state.placeIndex} actionSelect={(ix) => this.selectPlace(ix)} />
        </CardActions>
      </Card>
    )
  }
}


const Title = (props) => (
  <h1>{props.placeName ? props.placeName + 'の天気' : '天気情報'}</h1>
)
Title.propTypes = {
  placeName: PropTypes.string
}

const WeaterInfomation = (props) => (
  <List>
    <ListItem>
      <ListItemIcon><WeatherIcon/></ListItemIcon>
      <ListItemText primary={props.weather} />
    </ListItem>
    <ListItem>
      <ListItemIcon><TemperatureIcon/></ListItemIcon>
      <ListItemText primary={props.temperature ? `${props.temperature} ℃` : ''} />
    </ListItem>
  </List>
)
WeaterInfomation.propTypes = {
  weather: PropTypes.string,
  temperature: PropTypes.number
}

const PlaceSelector = (props) => (
  <FormControl style={{width: 200}}>
    <InputLabel>場所を選択</InputLabel>
    <Select value={props.placeIndex} onChange={
      (event) => props.actionSelect(event.target.value)}>
      {props.places.map((place, ix) => <MenuItem key={ix} value={ix}>{place.name}</MenuItem>)}
    </Select>
  </FormControl>
)
PlaceSelector.propTypes = {
  places: PropTypes.array,
  placeIndex: PropTypes.number,
  actionSelect: PropTypes.func
}

ReactDOM.render(
  <WeatherPage />,
  document.getElementById('root')
)
```

