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
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
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
  const tabStyle = {width: 200, height: 50, textAlign: 'center', color: '#fff', backgroundColor: '#01bcd4', borderRadius: 0}
  const activeStyle = (path) => Object.assign({borderBottom: `solid 2px ${props.location.pathname.match(path) ? '#f00' : '#01bcd4'}`}, tabStyle)

  useEffect(() => { getResult() }, [])

  return (
    <div style={{marginLeft: 30}}>
      <Header>じゃんけん ポン！</Header>
      <JyankenBox actionPon={(te) => pon(te)} />
      <Paper style={{width: 400}} zDepth={2}>
        <Link id="tab-scores" to="/scores" style={{textDecoration: 'none'}}><Button style={activeStyle('scores')}>対戦結果</Button></Link>
        <Link id="tab-status" to="/status" style={{textDecoration: 'none'}}><Button style={activeStyle('status')}>対戦成績</Button></Link>
        <Route path="/scores" component={() => <ScoreList scores={scores} />}/>
        <Route path="/status" component={() => <StatusBox status={status} />}/>
        <Route exact path="/" component={() => <Redirect to="/scores" />}/>
      </Paper>
    </div>
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

const Places = [{name: '札幌', id: 2128295}, {name: '東京', id: 1850147},
                {name: '大阪', id: 1853909}, {name: '沖縄', id: 1894616}]
const OpenWeatherMapKey = "＊＊ ここに取得したAPIキーを書いて下さい ＊＊"

const WeatherPage = () => {
  const [placeIndex, setPlaceIndex] = useState(null)
  const [weather, setWeather] = useState(null)
  const [temperature, setTemperature] = useState(null)
  const [loading, setLoading] = useState(false)

  const selectPlace = (index) => {
    setPlaceIndex(index)
    setWeather(null)
    setTemperature(null)
    setLoading(true)
    getWeather(Places[index].id)
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

  const placeName = placeIndex === null ? "" : Places[placeIndex].name
  return (
    <Card style={{margin: 30}}>
      <CardHeader title={<Title placeName={placeName} />} />
      <CardContent style={{position: 'relative'}}>
        {loading ? <CircularProgress style={{position: "absolute", top:40, left: 100}} /> : null}
        <WeaterInfomation weather={weather} temperature={temperature} />
      </CardContent>
      <CardActions>
        <PlaceSelector places={Places} placeIndex={placeIndex} actionSelect={(ix) => selectPlace(ix)} />
      </CardActions>
    </Card>
  )
}


// ・・・ 以下は同じです ・・・


```