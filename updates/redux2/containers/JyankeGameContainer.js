
import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route,  Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux'

import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'

import Header from '../components/Header'
import JyankenBox from '../components/JyankenBox'
import ScoreListContainer from './ScoreListContainer'
import StatusBoxContainer from './StatusBoxContainer'

import { jyankenPon } from '../actions'

const JyankeGameContainer = (props) => {
  const tabStyle= {width: 200, height: 50, textAlign: 'center', color: '#fff', backgroundColor: '#01bcd4', borderRadius: 0}
  const activeStyle = (path) => Object.assign({borderBottom: `solid 2px ${props.pathname.match(path) ? '#f00' : '#01bcd4'}`}, tabStyle)
  return (
      <div style={{marginLeft: 30}}>
        <Header>じゃんけん ポン！</Header>
        <JyankenBox actionPon={(te) => props.onClick(te)} />
        <Paper style={{width: 400}} zDepth={2}>
          <Link id="tab-scores" to="/scores" style={{textDecoration: 'none'}}><Button style={activeStyle('scores')}>対戦結果</Button></Link>
          <Link id="tab-status" to="/status" style={{textDecoration: 'none'}}><Button style={activeStyle('status')}>対戦成績</Button></Link>
          <Switch>
            <Route path="/scores" render={() => <ScoreListContainer />}/>
            <Route path="/status" render={() => <StatusBoxContainer />}/>
            <Route exat path="/" render={() => <Redirect to="/scores" />}/>
          </Switch>
        </Paper>
      </div>
  )
}
JyankeGameContainer.propTypes = {
onClick: PropTypes.func,
pathname: PropTypes.string
}


const mapStateToProps = (state) => ({
  pathname: state.router.location.pathname
})

const mapDispatchToProps = (dispatch) => ({
  onClick: (human) => dispatch(jyankenPon(human))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JyankeGameContainer)
