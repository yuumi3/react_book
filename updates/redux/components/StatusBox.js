import React from 'react'
import PropTypes from 'prop-types'
import { Table, TableBody, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import { judgmentStyle } from './common'

const StatusBox = (props) => (
  <Table>
    <TableBody displayRowCheckbox={false}>
      <TableRow displayBorder={false}>
        <TableHeaderColumn>勝ち</TableHeaderColumn><TableRowColumn style={judgmentStyle(1)}>{props.status.win}</TableRowColumn>
      </TableRow>
      <TableRow displayBorder={false}>
        <TableHeaderColumn>負け</TableHeaderColumn><TableRowColumn style={judgmentStyle(2)}>{props.status.lose}</TableRowColumn>
      </TableRow>
      <TableRow displayBorder={false}>
        <TableHeaderColumn>引き分け</TableHeaderColumn><TableRowColumn style={judgmentStyle(0)}>{props.status.draw}</TableRowColumn>
      </TableRow>
    </TableBody>
  </Table>
)
StatusBox.propTypes = {
  status: PropTypes.object
}

export default StatusBox