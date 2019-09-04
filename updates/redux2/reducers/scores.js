import { JYANKEN_PON } from '../actions'
import Jyanken from '../models/Jyanken'

const scores = (state = [], action) => {
  switch (action.type) {
    case JYANKEN_PON: {
      const judgment = Jyanken.judgment(action.computer, action.human)
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

export default scores