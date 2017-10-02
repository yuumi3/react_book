# コンポーネント

## 6-1 新しいプロジェクトの作成


* Mac: hello_reactプロジェクトをコピーしてjyankenプロジェクトを作る

```shell
mkdir jyanken
cd jyanken
mkdir src public
cp ../hello_react/{.b*,.e*,pa*,w*} .
cp ../hello_react/public/index.html public
npm install
```

※ プロンプトは省略しました

* Windows: hello_reactプロジェクトをコピーしてjyankenプロジェクトを作る

```dos
mkdir jyanken
cd jyanken
mkdir src public
xcopy ..\hello_react . /c /h
copy ..\hello_react\public\index.html public
npm install
```

※ プロンプトは省略しました

## 6-2 最初のコード

```js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import './index.css'

class JyankeGamePage extends Component {
  constructor(props) {
    super(props)
    this.state = {human: null, computer: null}
  }
  pon(human_hand) {
    const computer_hand = Math.floor(Math.random() * 3)
    this.setState({human: human_hand, computer: computer_hand})
  }
  judge() {
    if (this.state.human == null) {
      return null
    } else {
      return (this.state.computer - this.state.human + 3) % 3
    }
  }
  render() {
    return (
      <div>
        <h1>じゃんけん ポン！</h1>
        <JyankenBox actionPon={(te) => this.pon(te)} />
        <ScoreBox human={this.state.human} computer={this.state.computer} judgment={this.judge()} />
      </div>
    )
  }
}

const JyankenBox = (props) => {
  return (
    <div>
      <button onClick={() => props.actionPon(0)}>グー</button>
      <button onClick={() => props.actionPon(1)}>チョキ</button>
      <button onClick={() => props.actionPon(2)}>パー</button>
    </div>
  )
}
JyankenBox.propTypes = {
  actionPon: PropTypes.func
}

const ScoreBox = (props) => {
  const teString = ["グー","チョキ", "パー"]
  const judgmentString = ["引き分け","勝ち", "負け"]
  return (
    <table>
      <tbody>
        <tr><th>あなた</th><td>{teString[props.human]}</td></tr>
        <tr><th>Computer</th><td>{teString[props.computer]}</td></tr>
        <tr><th>勝敗</th><td>{judgmentString[props.judgment]}</td></tr>
      </tbody>
    </table>
  )
}
ScoreBox.propTypes = {
  human: PropTypes.number,
  computer: PropTypes.number,
  judgment: PropTypes.number
}

ReactDOM.render(
  <JyankeGamePage />,
  document.getElementById('root')
)
```

* src/index.css

```css
div#root { padding: 10px; }
button { margin: 0 10px; }
table { margin-top: 20px; }
th { font-weight: 400; text-align: left; }
```

## 6-5 ライフサイクル・メソッド

```js
  componentDidMount() {
    setTimeout(() => {this.pon(1)}, 1000)
  }
```

```js
  shouldComponentUpdate(nextProps, nextState) {
    const identical = nextState.human == this.state.human && nextState.computer == this.state.computer
    if (identical) { console.log("*Identical*") }
    return !identical
  }
```


## 6-7 フォーム

JSXの章で作った money_book を改造します。

### 6-7-1 Controlled Components

* src/index.js

```js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import './index.css'

class MoneyBook extends Component {
  constructor(props) {
    super(props)
    this.state = {books: []}
  }
  componentDidMount() {
    this.setState({books: [
    {date: "1/1", item: "お年玉", amount: 10000},
    {date: "1/3", item: "ケーキ", amount: -500},
    {date: "2/1", item: "小遣い", amount: 3000},
    {date: "2/5", item: "マンガ", amount: -600}
    ]})
  }
  addBook(date, item, amount) {
    const book = {date: date, item: item, amount: amount}
    this.setState({books: this.state.books.concat(book)})
  }
  render() {
    return (
      <div>
        <Title>小遣い帳</Title>
        <MoneyBookList books={this.state.books} />
        <MoneyEntry add={(date, item, amount) => this.addBook(date, item, amount)} />
      </div>
    )
  }
}

class MoneyEntry extends Component {
  constructor(props) {
    super(props)
    this.state = {date: '', item: '', amount: '', payingIn: true}
  }
  onChangeDate(event) {
    this.setState({date: event.target.value})
  }
  onChangeItem(event) {
    this.setState({item: event.target.value})
  }
  onChangeAmount(event) {
    this.setState({amount: event.target.value})
  }
  onChanePayingIn(event) {
    this.setState({payingIn: event.target.value == "on"})
  }
  onClickSubmit() {
    this.props.add(this.state.date, this.state.item, this.state.amount * (this.state.payingIn ? 1 : -1))
    this.setState({date: '', item: '', amount: '', payingIn: false})
  }
  render() {
    return (
      <div className="entry">
        <fieldset>
          <legend>記帳</legend>
          <div>
            <input type="radio" value="on" checked={this.state.payingIn} onChange={(event) => this.onChanePayingIn(event)} /> 入金
            <input type="radio" value="off" checked={!this.state.payingIn} onChange={(event) => this.onChanePayingIn(event)} /> 出金
          </div>
          <div>日付: <input type="text" value={this.state.date} onChange={(event) => this.onChangeDate(event)} placeholder="3/15" /> </div>
          <div>項目: <input type="text" value={this.state.item} onChange={(event) => this.onChangeItem(event)} placeholder="おこづかい" /> </div>
          <div>金額: <input type="text" value={this.state.amount} onChange={(event) => this.onChangeAmount(event)} placeholder="1000" /> </div>
          <div> <input type="submit" value="追加" onClick={() => this.onClickSubmit()} /> </div>
        </fieldset>
      </div>
    )
  }
}
MoneyEntry.propTypes = {
  add: PropTypes.func.isRequired
}

const MoneyBookList = (props) => {
  return (
    <div>
      <table className="book">
        <thead  data-type="ok">
          <tr><th>日付</th><th>項目</th><th>入金</th><th>出金</th></tr>
        </thead>
        <tbody>
          {props.books.map((book) =>
            <MoneyBookItem book={book} key={book.date + book.item} /> )}
         </tbody>
      </table>
    </div>
  )
}
MoneyBookList.propTypes = {
  books: PropTypes.array.isRequired
}

const MoneyBookItem = (props) => {
  const {date, item, amount} = props.book
  return (
    <tr>
      <td>{date}</td>
      <td>{item}</td>
      <td>{amount >= 0 ? amount : null}</td>
      <td>{amount < 0  ? -amount : null}</td>
    </tr>
  )
}
MoneyBookItem.propTypes = {
  book: PropTypes.object.isRequired
}

const Title = (props) => {
  return (<h1>{props.children}</h1>)
}
Title.propTypes = {
  children: PropTypes.string
}

ReactDOM.render(
  <MoneyBook />,
  document.getElementById('root')
)
```

* src/index.css

```css
.book {
  border-collapse: collapse;
  width: 300px;
}
.book th, .book td {
  border: solid 1px;
  padding: 1px 15px;
}
.entry {
  margin-top: 20px;
  width: 300px;
}
.entry input[type="submit"] {
  margin-top: 10px;
  width: 60px;
  font-size: 120%;
}
.entry input[type="radio"] {
  margin-left: 40px;
  margin-bottom: 10px;
}
```

### 6-7-1 Controlled Components(少し改造)

* src/index.js

```js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import './index.css'

class MoneyBook extends Component {
  constructor(props) {
    super(props)
    this.state = {books: []}
  }
  componentDidMount() {
    this.setState({books: [
    {date: "1/1", item: "お年玉", amount: 10000},
    {date: "1/3", item: "ケーキ", amount: -500},
    {date: "2/1", item: "小遣い", amount: 3000},
    {date: "2/5", item: "マンガ", amount: -600}
    ]})
  }
  addBook(date, item, amount) {
    const book = {date: date, item: item, amount: amount}
    this.setState({books: this.state.books.concat(book)})
  }
  render() {
    return (
      <div>
        <Title>小遣い帳</Title>
        <MoneyBookList books={this.state.books} />
        <MoneyEntry add={(date, item, amount) => this.addBook(date, item, amount)} />
      </div>
    )
  }
}

class MoneyEntry extends Component {
  constructor(props) {
    super(props)
    this.state = {date: '', item: '', amount: '', payingIn: true}
  }
  onChanePayingIn(event) {
    this.setState({payingIn: event.target.value == "on"})
  }
  onClickSubmit() {
    this.props.add(this.state.date, this.state.item, this.state.amount * (this.state.payingIn ? 1 : -1))
    this.setState({date: '', item: '', amount: '', payingIn: false})
  }
  onChangeValue(event) {
    this.setState({[event.target.name] : event.target.value})
  }
  render() {
    return (
      <div className="entry">
        <fieldset>
          <legend>記帳</legend>
          <div>
            <input type="radio" value="on" checked={this.state.payingIn} onChange={(event) => this.onChanePayingIn(event)} /> 入金
            <input type="radio" value="off" checked={!this.state.payingIn} onChange={(event) => this.onChanePayingIn(event)} /> 出金
          </div>
          <div>日付: <input type="text" value={this.state.date} name="date" onChange={(e) => this.onChangeValue(e)} placeholder="3/15" /> </div>
          <div>項目: <input type="text" value={this.state.item} name="item" onChange={(e) => this.onChangeValue(e)} placeholder="おこづかい" /> </div>
          <div>金額: <input type="text" value={this.state.amount} name="amount" onChange={(e) => this.onChangeValue(e)} placeholder="1000" /> </div>
          <div> <input type="submit" value="追加" onClick={() => this.onClickSubmit()} /> </div>
        </fieldset>
      </div>
    )
  }
}
MoneyEntry.propTypes = {
  add: PropTypes.func.isRequired
}

const MoneyBookList = (props) => {
  return (
    <div>
      <table className="book">
        <thead  data-type="ok">
          <tr><th>日付</th><th>項目</th><th>入金</th><th>出金</th></tr>
        </thead>
        <tbody>
          {props.books.map((book) =>
            <MoneyBookItem book={book} key={book.date + book.item} /> )}
         </tbody>
      </table>
    </div>
  )
}
MoneyBookList.propTypes = {
  books: PropTypes.array.isRequired
}

const MoneyBookItem = (props) => {
  const {date, item, amount} = props.book
  return (
    <tr>
      <td>{date}</td>
      <td>{item}</td>
      <td>{amount >= 0 ? amount : null}</td>
      <td>{amount < 0  ? -amount : null}</td>
    </tr>
  )
}
MoneyBookItem.propTypes = {
  book: PropTypes.object.isRequired
}

const Title = (props) => {
  return (<h1>{props.children}</h1>)
}
Title.propTypes = {
  children: PropTypes.string
}

ReactDOM.render(
  <MoneyBook />,
  document.getElementById('root')
)
```

* src/index.css は変更ありません


### 6-7-2 Uncontrolled Components

* src/index.js

```js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import './index.css'

class MoneyBook extends Component {
  constructor(props) {
    super(props)
    this.state = {books: []}
  }
  componentDidMount() {
    this.setState({books: [
    {date: "1/1", item: "お年玉", amount: 10000},
    {date: "1/3", item: "ケーキ", amount: -500},
    {date: "2/1", item: "小遣い", amount: 3000},
    {date: "2/5", item: "マンガ", amount: -600}
    ]})
  }
  addBook(date, item, amount) {
    const book = {date: date, item: item, amount: amount}
    this.setState({books: this.state.books.concat(book)})
  }
  render() {
    return (
      <div>
        <Title>小遣い帳</Title>
        <MoneyBookList books={this.state.books} />
        <MoneyEntry add={(date, item, amount) => this.addBook(date, item, amount)} />
      </div>
    )
  }
}

class MoneyEntry extends Component {
  constructor(props) {
    super(props)
    this.date   = null
    this.item   = null
    this.amount = null
    this.payingIn = null
  }
  onClickSubmit() {
    this.props.add(this.date.value, this.item.value, this.amount.value * (this.payingIn.checked ? 1 : -1))
    this.date.value   = ""
    this.item.value   = ""
    this.amount.value = ""
    this.payingIn.checked = true
  }
  render() {
    return (
      <div className="entry">
        <fieldset>
          <legend>記帳</legend>
          <div>
            <input type="radio" defaultChecked name="payingInOut" ref={(node) => this.payingIn = node} /> 入金
            <input type="radio" name="payingInOut" /> 出金
          </div>
          <div>日付: <input type="text" defaultValue="" ref={(node) => this.date = node} placeholder="3/15" /> </div>
          <div>項目: <input type="text" defaultValue="" ref={(node) => this.item = node} placeholder="おこづかい" /> </div>
          <div>金額: <input type="text" defaultValue="" ref={(node) => this.amount = node} placeholder="1000" /> </div>
          <div> <input type="submit" value="追加" onClick={() => this.onClickSubmit()} /> </div>
        </fieldset>
      </div>
    )
  }
}
MoneyEntry.propTypes = {
  add: PropTypes.func.isRequired
}

const MoneyBookList = (props) => {
  return (
    <div>
      <table className="book">
        <thead  data-type="ok">
          <tr><th>日付</th><th>項目</th><th>入金</th><th>出金</th></tr>
        </thead>
        <tbody>
          {props.books.map((book) =>
            <MoneyBookItem book={book} key={book.date + book.item} /> )}
         </tbody>
      </table>
    </div>
  )
}
MoneyBookList.propTypes = {
  books: PropTypes.array.isRequired
}

const MoneyBookItem = (props) => {
  const {date, item, amount} = props.book
  return (
    <tr>
      <td>{date}</td>
      <td>{item}</td>
      <td>{amount >= 0 ? amount : null}</td>
      <td>{amount < 0  ? -amount : null}</td>
    </tr>
  )
}
MoneyBookItem.propTypes = {
  book: PropTypes.object.isRequired
}

const Title = (props) => {
  return (<h1>{props.children}</h1>)
}
Title.propTypes = {
  children: PropTypes.string
}

ReactDOM.render(
  <MoneyBook />,
  document.getElementById('root')
)
```

* src/index.css は変更ありません

### 6-7-4 その他のフォーム要素

* src/index.js

```js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import './index.css'

class MoneyBook extends Component {
  constructor(props) {
    super(props)
    this.state = {books: []}
  }
  componentDidMount() {
    this.setState({books: [
    {date: "1/1", item: "お年玉", amount: 10000},
    {date: "1/3", item: "ケーキ", amount: -500},
    {date: "2/1", item: "小遣い", amount: 3000},
    {date: "2/5", item: "マンガ", amount: -600}
    ]})
  }
  addBook(date, item, amount) {
    const book = {date: date, item: item, amount: amount}
    this.setState({books: this.state.books.concat(book)})
  }
  render() {
    return (
      <div>
        <Title>小遣い帳</Title>
        <MoneyBookList books={this.state.books} />
        <MoneyEntry add={(date, item, amount) => this.addBook(date, item, amount)} />
      </div>
    )
  }
}

class MoneyEntry extends Component {
  constructor(props) {
    super(props)
    this.state = {date: '', item: '', amount: '', payingIn: true}
  }
  onChanePayingIn(event) {
    this.setState({payingIn: event.target.value == "on"})
  }
  onClickSubmit() {
    this.props.add(this.state.date, this.state.item, this.state.amount * (this.state.payingIn ? 1 : -1))
    this.setState({date: '', item: '', amount: '', payingIn: false})
  }
  onChangeValue(event) {
    this.setState({[event.target.name] : event.target.value})
  }
  render() {
    return (
      <div className="entry">
        <fieldset>
          <legend>記帳</legend>
          <div>
            <select value={this.state.payingIn ? "on" : "off"} onChange={(e) => this.onChanePayingIn(e)}>
              <option value="on">入金</option>
              <option value="off">出金</option>
            </select>
          </div>
          <div>日付: <input type="text" value={this.state.date} name="date" onChange={(e) => this.onChangeValue(e)} placeholder="3/15" /> </div>
          <div>項目: <textarea value={this.state.item} name="item" onChange={(e) => this.onChangeValue(e)} placeholder="おこづかい" /> </div>
          <div>金額: <input type="text" value={this.state.amount} name="amount" onChange={(e) => this.onChangeValue(e)} placeholder="1000" /> </div>
          <div>フルーツ: <Fruits /> </div>
          <div> <input type="submit" value="追加" onClick={() => this.onClickSubmit()} /> </div>
        </fieldset>
      </div>
    )
  }
}
MoneyEntry.propTypes = {
  add: PropTypes.func.isRequired
}

class Fruits extends Component {
   constructor(props) {
    super(props)
    this.state = {basket: []}
  }
  onChangeValue(event) {
    this.setState({basket: Array.from(event.target.options).filter((e) => e.selected).map((e) => e.value)})
  }
  render() {
    return (
      <select multiple value={this.state.basket} onChange={(e) => this.onChangeValue(e)}>
        <option>Orange</option>
        <option>Apple</option>
        <option>Grape</option>
      </select>
    )
  }
}

const MoneyBookList = (props) => {
  return (
    <div>
      <table className="book">
        <thead  data-type="ok">
          <tr><th>日付</th><th>項目</th><th>入金</th><th>出金</th></tr>
        </thead>
        <tbody>
          {props.books.map((book) =>
            <MoneyBookItem book={book} key={book.date + book.item} /> )}
         </tbody>
      </table>
    </div>
  )
}
MoneyBookList.propTypes = {
  books: PropTypes.array.isRequired
}

const MoneyBookItem = (props) => {
  const {date, item, amount} = props.book
  return (
    <tr>
      <td>{date}</td>
      <td>{item}</td>
      <td>{amount >= 0 ? amount : null}</td>
      <td>{amount < 0  ? -amount : null}</td>
    </tr>
  )
}
MoneyBookItem.propTypes = {
  book: PropTypes.object.isRequired
}

const Title = (props) => {
  return (<h1>{props.children}</h1>)
}
Title.propTypes = {
  children: PropTypes.string
}

ReactDOM.render(
  <MoneyBook />,
  document.getElementById('root')
)
```

* src/index.css は変更ありません


