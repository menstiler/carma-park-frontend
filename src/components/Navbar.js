import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Dropdown, Menu, Message, Icon, Label } from 'semantic-ui-react'

import { closeActiveNotification, logout, handleNotificationDismiss, toggleShowNotifications} from '../actions'

class Navbar extends React.Component{

  renderNotifications = () => {
    let notifications = this.props.notifications
    let filteredNotifications = notifications.filter(notication => notication.user_id === this.props.currentUser)
    if (this.props.showNotifications) {
      return filteredNotifications.map(notification =>
        <Message
          id="showNotifications"
          key={notification.id}
           onDismiss={() => this.props.handleNotificationDismiss(notification.id)}
           content={notification.message}
         />
      )
    }
  }

  renderUser = () => {
    let activeItem;
    if (this.props.loading) {
      return (
        <div class="loader">
          <svg class="car" width="102" height="40" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(2 1)" stroke="#808080" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">
              <path class="car__body" d="M47.293 2.375C52.927.792 54.017.805 54.017.805c2.613-.445 6.838-.337 9.42.237l8.381 1.863c2.59.576 6.164 2.606 7.98 4.531l6.348 6.732 6.245 1.877c3.098.508 5.609 3.431 5.609 6.507v4.206c0 .29-2.536 4.189-5.687 4.189H36.808c-2.655 0-4.34-2.1-3.688-4.67 0 0 3.71-19.944 14.173-23.902zM36.5 15.5h54.01" stroke-width="3"/>
              <ellipse class="car__wheel--left" stroke-width="3.2" fill="#FFF" cx="83.493" cy="30.25" rx="6.922" ry="6.808"/>
              <ellipse class="car__wheel--right" stroke-width="3.2" fill="#FFF" cx="46.511" cy="30.25" rx="6.922" ry="6.808"/>
              <path class="car__line car__line--top" d="M22.5 16.5H2.475" stroke-width="3"/>
              <path class="car__line car__line--middle" d="M20.5 23.5H.4755" stroke-width="3"/>
              <path class="car__line car__line--bottom" d="M25.5 9.5h-19" stroke-width="3"/>
            </g>
          </svg>
        </div>
      )
    } else {
        return (
          <>
          <Menu>
            {
              this.props.currentUser
              ?
              <>
              <Menu.Item>
                <Icon name='user' />
                {this.props.users.find(user => user.id === this.props.currentUser).name}
              </Menu.Item>
              <Menu.Item id="toggleNotifications" name='notification' active={activeItem === 'notification'} >
              {
                this.props.notifications.length
                ?
                <>
                  <Icon name='bell' id="toggleNotifications" />
                  Notifications
                  <Label color='teal' id="toggleNotifications">{this.props.notifications.length}</Label>
                </>
                :
                <>
                  <Icon name='bell slash open' />
                  Notifications
                  <Label>{this.props.notifications.length}</Label>
                </>
              }
              </Menu.Item>
              </>
              :
              null
            }
            {
              this.props.currentUser && this.props.activeNotification
              ?
              <Message
                id="active-message"
                onDismiss={this.props.closeActiveNotification}
                content={this.props.activeNotification.message}
               />
              :
              null
            }
            <div id="active-notification"></div>
            {
              this.props.currentUser
              ?
              <Menu.Menu position='right'>
                  <Link to={"/add_space"} className="item">
                    Add Parking Spot
                    </Link>
                <Menu.Item name='logout' onClick={() => this.props.logout(this.props.routerProps.history)}>
                  Logout
                </Menu.Item>
              </Menu.Menu>
              :
              <Menu.Menu position='right' >
                <Link to='/login' className="item">
                    Login
                </Link>
                <Link to='/sign_up' className="item">
                    Sign Up
                </Link>
              </Menu.Menu>
            }
            </Menu>
          {
            this.props.showNotifications && this.props.notifications.length
            ?
            <div className="notifications" id="showNotifications">
              <Dropdown.Menu floating id="showNotifications">
                {this.renderNotifications()}
              </Dropdown.Menu>
            </div>
            :
            null
          }
        </>
      )
    }
  }

  render() {
    return (
      <div>
        {this.renderUser()}
      </div>
    )
  }
}

function msp(state) {
  return {
    users: state.user.users,
    currentUser: state.user.currentUser,
    loading: state.map.loading,
    notifications: state.user.notifications,
    showNotifications: state.user.showNotifications,
    activeNotification: state.user.activeNotification
  }
}

export default connect(msp, {
  logout, handleNotificationDismiss, toggleShowNotifications, closeActiveNotification
})(Navbar);
