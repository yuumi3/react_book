import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'

const JyankenBox = (props) => {
  const style = {marginLeft: 20}
  return (
    <div style={{marginTop: 40, marginBottom: 30, marginLeft: 50}}>
      <Button variant="contained" id="btn-guu" onClick={() => props.actionPon(0)} style={style}>グー</Button>
      <Button variant="contained" id="btn-choki" onClick={() => props.actionPon(1)} style={style}>チョキ</Button>
      <Button variant="contained" id="btn-paa" onClick={() => props.actionPon(2)} style={style}>パー</Button>
    </div>
  )
}
JyankenBox.propTypes = {
  actionPon: PropTypes.func
}

export default JyankenBox