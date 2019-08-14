import React from 'react'
import { connect } from 'react-redux'

function Navbar(props) {
  let currentUser = props.users.length ? props.users.find(user => user.id === props.currentUser).name : 'Welcome';
  return(
    <p>{currentUser}</p>
  )
}

function msp(state) {
  return {
    users: state.map.users,
    currentUser: state.user.currentUser
  }
}

export default connect(msp, {

})(Navbar);
