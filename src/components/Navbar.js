import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Dropdown, Menu, Message, Icon, Label, Button } from 'semantic-ui-react'

import { deleteAllNotifications, closeActiveNotification, logout, handleNotificationDismiss, toggleShowNotifications} from '../actions'

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

  renderMenu = (e) => {
    if (!e.target.parentNode.parentNode.classList.contains("mobile")) {
      e.target.parentNode.parentNode.classList.add("mobile");
    } else {
      e.target.parentNode.parentNode.classList.remove("mobile");
    }
  }


  renderNavbar = () => {
    if (this.props.loading) {
      return (
        <div className="loader">
          <svg className="car" width="102" height="40" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(2 1)" stroke="#808080" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
              <path className="car__body" d="M47.293 2.375C52.927.792 54.017.805 54.017.805c2.613-.445 6.838-.337 9.42.237l8.381 1.863c2.59.576 6.164 2.606 7.98 4.531l6.348 6.732 6.245 1.877c3.098.508 5.609 3.431 5.609 6.507v4.206c0 .29-2.536 4.189-5.687 4.189H36.808c-2.655 0-4.34-2.1-3.688-4.67 0 0 3.71-19.944 14.173-23.902zM36.5 15.5h54.01" strokeWidth="3"/>
              <ellipse className="car__wheel--left" strokeWidth="3.2" fill="#FFF" cx="83.493" cy="30.25" rx="6.922" ry="6.808"/>
              <ellipse className="car__wheel--right" strokeWidth="3.2" fill="#FFF" cx="46.511" cy="30.25" rx="6.922" ry="6.808"/>
              <path className="car__line car__line--top" d="M22.5 16.5H2.475" strokeWidth="3"/>
              <path className="car__line car__line--middle" d="M20.5 23.5H.4755" strokeWidth="3"/>
              <path className="car__line car__line--bottom" d="M25.5 9.5h-19" strokeWidth="3"/>
            </g>
          </svg>
        </div>
      )
    } else {
        return (
          <>
          <Menu>
            <Menu.Item className="burger-icon" onClick={this.renderMenu} >
              <Icon name='bars'  />
            </Menu.Item>
            <div className="sub-menu">
              {
                this.props.currentUser
                ?
                <>
                <Menu.Item>
                  <Icon name='user' />
                  {this.props.users.find(user => user.id === this.props.currentUser).name}
                </Menu.Item>
                <Menu.Item id="toggleNotifications" >
                {
                  this.props.notifications.filter(notication => notication.user_id === this.props.currentUser).length
                  ?
                  <>
                    <Icon name='bell' id="toggleNotifications" />
                    Notifications
                    <Label color='teal' id="toggleNotifications">{this.props.notifications.filter(notication => notication.user_id === this.props.currentUser).length}</Label>
                  </>
                  :
                  <>
                    <Icon name='bell slash' />
                    Notifications
                    <Label>0</Label>
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
                {
                  this.props.routerProps.location.pathname === "/add_space"
                  ?
                  <Link to={"/"} className="item" >
                    Find Parking Spot
                  </Link>
                  :
                  <Link to={"/add_space"} className="item" >
                    Add Parking Spot
                  </Link>
                }
                  <Menu.Item name='logout' onClick={() => this.props.logout(this.props.routerProps.history)}>
                    Logout
                  </Menu.Item>
                </Menu.Menu>
                :
                <Menu.Menu position='right' >
                  <Link to='/login' className="item"  onClick={this.handleItemClick} >
                      Login
                  </Link>
                  <Link to='/sign_up' className="item">
                      Sign Up
                  </Link>
                </Menu.Menu>
              }
              </div>
              </Menu>
            {
              this.props.showNotifications && (this.props.notifications.filter(notication => notication.user_id === this.props.currentUser).length)
              ?
              <div className="notifications" id="showNotifications">
                <Dropdown.Menu id="showNotifications">
                  {this.renderNotifications()}
                  <Button  inverted color='red' onClick={() => this.props.deleteAllNotifications(this.props.currentUser)}>Delete All</Button>
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
        {this.renderNavbar()}
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
  logout, handleNotificationDismiss, toggleShowNotifications, closeActiveNotification, deleteAllNotifications
})(Navbar);
