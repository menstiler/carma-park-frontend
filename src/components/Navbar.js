import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Dropdown, Menu, Message, Icon, Label, Button } from 'semantic-ui-react'
import { deleteAllNotifications, handleNotificationDismiss, closeActiveNotification, toggleShowNotifications } from '../actions/notification'
import { logout } from '../actions/user'
import '../styles/navbar.scss';
import '../styles/loader.scss';
import Loader from './Loader'

class Navbar extends React.Component{
  
  renderNotifications = () => {
    let notifications = this.props.notifications
    if (this.props.showNotifications) {
      return notifications.map(notification =>
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
      return <Loader />
    } else {
      return (
        <div className="navbar">
          <Menu>
            <Menu.Item className="burger-icon" onClick={this.renderMenu} >
              <Icon name='bars'  />
            </Menu.Item>
            <div className="sub-menu">
              {
                this.props.currentUser
                ?
                <>
                  { 
                    this.props.routerProps.location.pathname !== "/profile"
                    ?
                    <Menu.Item as={Link} to='/profile' >
                      <Icon name='user' />
                      {this.props.currentUser.name}
                    </Menu.Item>
                    :
                    <Menu.Item as={Link} to='/' >
                      <Icon name='car' />
                      Find Parking
                    </Menu.Item>
                  }
                  <Menu.Item id="toggleNotifications" >
                    {
                      this.props.notifications 
                      ?
                      <>
                        <Icon name='bell' id="toggleNotifications" />
                        Notifications
                        <Label color='teal' id="toggleNotifications" > {
                          this.props.notifications.length
                        } 
                        </Label>
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
            this.props.showNotifications && this.props.notifications.length
            ?
            <div className="notifications" id="showNotifications">
              <Dropdown.Menu id="showNotifications">
                {this.renderNotifications()}
                {
                  this.props.notifications.length > 1
                  ?
                  <Button  inverted color='red' onClick={() => this.props.deleteAllNotifications(this.props.currentUser.id)}>Delete All</Button>
                  :
                  null
                }
              </Dropdown.Menu>
            </div>
            :
            null
          }
        </div>
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
  logout, 
  handleNotificationDismiss, 
  toggleShowNotifications, 
  closeActiveNotification, 
  deleteAllNotifications
})(Navbar);
