import React from 'react'
import PropTypes from 'prop-types'

const Header = (props) => (<h1>{props.children}</h1>)
Header.propTypes = {
  children: PropTypes.string
}

export default Header