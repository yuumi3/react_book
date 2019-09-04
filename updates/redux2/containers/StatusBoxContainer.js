import { connect } from 'react-redux'
import StatusBox from '../components/StatusBox'

const mapStateToProps = (state) => ({
  status: state.statuses
})

const mapDispatchToProps = (/*dispatch*/) => ({
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StatusBox)
