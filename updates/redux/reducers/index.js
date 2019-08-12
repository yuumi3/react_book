import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import scores from './scores'
import statuses from './statuses'


export default (history) => combineReducers({
  router: connectRouter(history),
  scores,
  statuses
})
