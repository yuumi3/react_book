import React from 'react'
import PropTypes from 'prop-types'
import RaisedButton from 'material-ui/RaisedButton'

const JyankenBox = (props) => {
  const style = {marginLeft: 20}
  return (
    <div style={{marginTop: 40, marginBottom: 30, marginLeft: 30}}>
      <RaisedButton id="btn-guu"   label="グー" onClick={() => props.actionPon(0)} style={style} />
      <RaisedButton id="btn-choki" label="チョキ" onClick={() => props.actionPon(1)} style={style} />
      <RaisedButton id="btn-paa"  label="パー" onClick={() => props.actionPon(2)} style={style} />
    </div>
  )
}
JyankenBox.propTypes = {
  actionPon: PropTypes.func
}

export default JyankenBox