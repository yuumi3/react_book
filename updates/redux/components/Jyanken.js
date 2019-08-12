import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route,  Redirect, Link } from 'react-router-dom'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import FlatButton from 'material-ui/FlatButton'
import Paper from 'material-ui/Paper';

import Header from './Header'
import JyankenBox from './JyankenBox'
import ScoreList from './ScoreList'
import StatusBox from './StatusBox'

const Jyanken = (props) => {
  const tabStyle = {width: 200, height: 50, textAlign: 'center', color: '#fff', backgroundColor: '#01bcd4'}
  const activeStyle = (path) => Object.assign({borderBottom: `solid 2px ${props.pathname.match(path) ? '#f00' : '#01bcd4'}`}, tabStyle)
  return (
    <MuiThemeProvider>
      <div style={{marginLeft: 30}}>
        <Header>じゃんけん ポン！</Header>
        <JyankenBox actionPon={(te) => props.onClick(te)} />
        <Paper style={{width: 400}} zDepth={2}>
          <Link id="tab-scores" to="/scores"><FlatButton label="対戦結果" style={activeStyle('scores')}/></Link>
          <Link id="tab-status" to="/status"><FlatButton label="対戦成績" style={activeStyle('status')}/></Link>
          <Switch>
            <Route path="/scores" render={() => <ScoreList scores={props.scores} />}/>
            <Route path="/status" render={() => <StatusBox status={props.status} />}/>
            <Route exat path="/" render={() => <Redirect to="/scores" />}/>
          </Switch>
        </Paper>
      </div>
    </MuiThemeProvider>
  )
}
Jyanken.propTypes = {
scores: PropTypes.array,
status: PropTypes.object,
onClick: PropTypes.func,
pathname: PropTypes.string
}

export default Jyanken