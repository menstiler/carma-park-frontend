import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { logout } from '../actions'

function Navbar(props) {

  const renderUser = () => {
    if (props.loading) {
      return <div>loading...</div>
    } else {
      if (props.currentUser) {
        return (
          <div>
            <p>{props.users.find(user => user.id === props.currentUser).name}</p>
            <button onClick={() => props.logout(props.routerProps.history)}>Logout</button>
          </div>
        )
      } else {
        return (
          <>
            <Link to='/login'>Login</Link>
            <Link to='/sign_up'>Sign Up</Link>
          </>
        )
      }
    }
  }

  return (
    <div>
      {renderUser()}
    </div>
  )
}

function msp(state) {
  return {
    users: state.user.users,
    currentUser: state.user.currentUser,
    loading: state.map.loading
  }
}

export default connect(msp, {
  logout
})(Navbar);
