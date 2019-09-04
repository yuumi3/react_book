import { JYANKEN_PON } from '../actions'
import Jyanken from '../models/Jyanken'

const statuses = (state = {draw: 0, win: 0, lose: 0}, action) => {
  switch (action.type) {
    case JYANKEN_PON: {
      const judgment = Jyanken.judgment(action.computer, action.human)
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

export default statuses