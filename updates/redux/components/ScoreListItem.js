import React from 'react'
import PropTypes from 'prop-types'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import { judgmentStyle } from './common'

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

export default ScoreListItem