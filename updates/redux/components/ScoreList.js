import React from 'react'
import PropTypes from 'prop-types'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';
import ScoreListItem from './ScoreListItem'

const ScoreList = (props) => (
  <Table>
    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
      <TableRow>
        <TableHeaderColumn>時間</TableHeaderColumn><TableHeaderColumn>人間</TableHeaderColumn><TableHeaderColumn>コンピュータ</TableHeaderColumn><TableHeaderColumn>結果</TableHeaderColumn>
      </TableRow>
    </TableHeader>
    <TableBody>
      {props.scores.map((score, ix) => <ScoreListItem key={ix} score={score} />)}
    </TableBody>
  </Table>
)
ScoreList.propTypes = {
  scores: PropTypes.array
}

export default ScoreList