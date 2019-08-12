import React from 'react'
import PropTypes from 'prop-types'
import { TableRow, TableRowColumn } from 'material-ui/Table';
import { judgmentStyle } from './common'

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

export default ScoreListItem