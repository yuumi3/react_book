# Hooks (useState, useEffect)

Hooks  (フック) は React 16.8 で追加された新機能です。state などの React の機能を、クラスを書かずに使えるようになります。  [公式ドキュメント](https://ja.reactjs.org/docs/hooks-intro.html)

## Hooks を使ったコード

一部のアプリを Hooksに対応してみました

### 7.2章 jyanken

* src/index.js

```js
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { BrowserRouter, Route,  Redirect, Link } from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import Paper from 'material-ui/Paper';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import Jyanken from './Jyanken'

const JyankenModel = new Jyanken()

const JyankeGamePage = (props) => {
  const [scores, setScores] = useState([])
  const [status, setStatus] = useState({})

  const getResult = () => {
    setScores(JyankenModel.getScores())
    setStatus(JyankenModel.getStatuses())
  }
  const pon = (te) => {
    JyankenModel.pon(te)
    getResult()
  }
  const tabStyle = {width: 200, height: 50, textAlign: 'center', color: '#fff', backgroundColor: '#01bcd4'}
  const activeStyle = (path) => Object.assign({borderBottom: `solid 2px ${props.location.pathname.match(path) ? '#f00' : '#01bcd4'}`}, tabStyle)

  useEffect(() => { getResult() }, [])

  return (
    <MuiThemeProvider>
      <div style={{marginLeft: 30}}>
        <Header>じゃんけん ポン！</Header>
        <JyankenBox actionPon={(te) => pon(te)} />
        <Paper style={{width: 400}} zDepth={2}>
          <Link id="tab-scores" to="/scores"><FlatButton label="対戦結果" style={activeStyle('scores')}/></Link>
          <Link id="tab-status" to="/status"><FlatButton label="対戦成績" style={activeStyle('status')}/></Link>
          <Route path="/scores" render={() => <ScoreList scores={scores} />}/>
          <Route path="/status" render={() => <StatusBox status={status} />}/>
          <Route exat path="/" render={() => <Redirect to="/scores" />}/>
        </Paper>
      </div>
    </MuiThemeProvider>
  )
}
JyankeGamePage.propTypes = {
  location: PropTypes.object
}


// ・・・ 以下は同じです ・・・


```

### 7.3章 weather

ここでは、Hooksの他に 非同期通信を async/await で書き直しました。

* .babelrc

この設定では最新版 Chrome, Edge, Safari に対応しています、 **IEには対応していません**。

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


* src/index.js

```js
import React, { useState } from 'react'
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

const Places = [{name: '札幌', id: 2128295}, {name: '東京', id: 1850147},
                {name: '大阪', id: 1853909}, {name: '沖縄', id: 1894616}]
const OpenWeatherMapKey = "** ここに取得したAPIキーを書いて下さい **"

const WeatherPage = () => {
  const [placeName, setPlaceName] = useState(null)
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [temperature, setTemperature] = useState(null)

  const selectPlace = (index) => {
    if (index > 0) {
      const place = Places[index - 1]
      setPlaceName(place.name)
      setLoading(true)
      getWeather(place.id)
    }
  }

  const getWeather = async(id) => {
    const delay = (mSec) => new Promise((resolve) => setTimeout(resolve, mSec))

    try {
      const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?appid=${OpenWeatherMapKey}&id=${
        id}&lang=ja&units=metric`)
      const json = await response.json()
      await delay(700)
      setWeather(json.weather[0].description)
      setTemperature(json.main.temp)
      setLoading(false)
    } catch(error) {
      setLoading(false)
      console.log('** error **', error)
    }
  }

  return (
    <MuiThemeProvider>
      <Card style={{margin: 30}}>
        <CardHeader title={<Title place={placeName} />} />
        <CardText style={{position: 'relative'}}>
          <RefreshIndicator status={loading ? 'loading' : 'hide'} top={40} left={100} loadingColor="#f00" />
          <WeaterInfomation weather={weather} temperature={temperature} />
        </CardText>
        <CardActions>
          <PlaceSelector places={Places} actionSelect={(ix) => selectPlace(ix)} />
        </CardActions>
      </Card>
    </MuiThemeProvider>
  )
}


// ・・・ 以下は同じです ・・・


```