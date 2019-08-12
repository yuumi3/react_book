import { connect } from 'react-redux'
import { jyankenPon } from '../actions'
import Jyanken from '../components/Jyanken'

const mapStateToProps = (state/*, ownProps*/) => ({
  scores: state.scores,
  status: state.statuses,
  pathname: state.router.location.pathname
})

const mapDispatchToProps = (dispatch/*, ownProps*/) => ({
  onClick: (human) => dispatch(jyankenPon(human))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Jyanken)
