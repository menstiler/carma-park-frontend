import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Message, Icon } from 'semantic-ui-react'

import { logout, handleNotificationDismiss, toggleShowNotifications} from '../actions'

function Navbar(props) {

  function toggleDropdown() {
    if (props.currentUser) {
    var myDropdown = document.getElementById("myDropdown");
      if (myDropdown.classList.contains('show')) {
        myDropdown.classList.remove('show');
      } else {
        myDropdown.classList.toggle("show")
      }
    }
  }

  function renderNotifications() {
    let notifications = props.notifications
    let filteredNotifications = notifications.filter(notication => notication.user_id === props.currentUser)
    if (props.showNotifications) {
      return filteredNotifications.map(notification =>
        <Message
          key={notification.id}
           onDismiss={() => props.handleNotificationDismiss(notification.id)}
           content={notification.message}
         />
      )
    }
  }

  const renderUser = () => {
    if (props.loading) {
      return <div>loading...</div>
    } else {
      if (props.currentUser) {
        return (
          <>
            <div className="navbar">
            <ul>
              <li style={{float: 'left'}}>
                {
                  props.notifications.length
                  ?
                  <Icon name='envelope open outline' onClick={props.toggleShowNotifications} />
                  :
                  <Icon name='envelope outline' onClick={props.toggleShowNotifications} />
                }
              </li>
              <li style={{float: 'right'}}>
                <div className="dropbtn" onClick={toggleDropdown} >
                  <i className="fa fa-caret-down"></i>
                  {props.users.find(user => user.id === props.currentUser).name}
                </div>
                <div className="dropdown-content" id="myDropdown">
                  <a onClick={() => props.logout(props.routerProps.history)}>Logout</a>
                  <Link to={"/add_space"}>Add Parking Spot</Link>
                </div>
              </li>
            </ul>
          </div>
          {
            props.showNotifications && props.notifications.length
            ?
            <div className="notifications">
              {renderNotifications()}
            </div>
            :
            null
          }
        </>
        )
      } else {
        return (
          <div className="navbar">
            <Link to='/login'>Login</Link>
            <Link to='/sign_up'>Sign Up</Link>
          </div>
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
    loading: state.map.loading,
    notifications: state.user.notifications,
    showNotifications: state.user.showNotifications
  }
}

export default connect(msp, {
  logout, handleNotificationDismiss, toggleShowNotifications
})(Navbar);
