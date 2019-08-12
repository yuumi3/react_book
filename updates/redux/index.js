import React from 'react'
import ReactDOM from 'react-dom'
import { createBrowserHistory } from 'history'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import logger from 'redux-logger'
import { routerMiddleware, ConnectedRouter } from 'connected-react-router'

import reducers from './reducers'
import JyankeGamePage from './containers/JyankeGamePage.js'


export const history = createBrowserHistory()
const store = createStore(
  reducers(history),
  applyMiddleware(routerMiddleware(history), logger)
)

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <JyankeGamePage/>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)
