import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Dropdown, Menu, Message, Icon, Label } from 'semantic-ui-react'

import { logout, handleNotificationDismiss, toggleShowNotifications} from '../actions'

class Navbar extends React.Component{

  state = {}

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })


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
      return <div class="ui active centered inline loader"></div>
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
              this.props.currentUser
              ?
              <Menu.Menu position='right'>
                <Menu.Item name='add_parking' active={activeItem === 'add_parking'} onClick={this.handleItemClick}>
                  <Link to={"/add_space"}>Add Parking Spot</Link>
                </Menu.Item>
                <Menu.Item name='logout' active={activeItem === 'logout'}  onClick={this.handleItemClick}>
                  <a onClick={() => this.props.logout(this.props.routerProps.history)}>Logout</a>
                </Menu.Item>
              </Menu.Menu>
              :
              <Menu.Menu position='right'>
                <Menu.Item name='login' active={activeItem === 'login'} onClick={this.handleItemClick}>
                  <Link to='/login'>Login</Link>
                </Menu.Item>
                <Menu.Item name='sign_up' active={activeItem === 'sign_up'}  onClick={this.handleItemClick}>
                  <Link to='/sign_up'>Sign Up</Link>
                </Menu.Item>
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
    showNotifications: state.user.showNotifications
  }
}

export default connect(msp, {
  logout, handleNotificationDismiss, toggleShowNotifications
})(Navbar);
