import React, { Component } from 'react'
import {
  connect
} from 'react-redux'

class Profile extends Component {

   componentWillReceiveProps() {
     if (!this.props.currentUser) {
       this.props.routerProps.history.push('/')
     }
   }

  render() {
    return (
      <div>
        {this.props.currentUser}
      </div>
    )
  }
}

function msp(state) {
  return {
    currentUser: state.user.currentUser
  }
}

export default connect(msp)(Profile);