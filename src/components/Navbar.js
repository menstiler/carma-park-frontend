import React from 'react'
import { connect } from 'react-redux'
import Login from './Login'
function Navbar(props) {
  return (
    <div>
      <Login />
    </div>
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
