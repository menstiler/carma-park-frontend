import React, { useRef, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Dropdown, Menu, Message, Icon, Button } from 'semantic-ui-react'
import { deleteAllNotifications, handleNotificationDismiss, closeActiveNotification, toggleShowNotifications } from '../actions/notification'
import { logout } from '../actions/user'
import '../styles/navbar.scss';
import '../styles/loader.scss';
import toast from 'react-hot-toast';

const Navbar = (props) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const openRef = useRef(null)
  const menuRef = useRef(null)

  const renderNotifications = () => {
    let notifications = props.notifications
    if (props.showNotifications) {
      return notifications.map(notification =>
        <Message
          id="showNotifications"
          key={notification.id}
           onDismiss={() => props.handleNotificationDismiss(notification.id)}
           content={notification.message}
         />
      )
    }
  }

  useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
  })
  
  useEffect(() => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false) 
    }
  }, [props.routerProps.location])

  // {
  //   props.currentUser && props.activeNotification
  //   ?
  //   <Message
  //     id="active-message"
  //     onDismiss={props.closeActiveNotification}
  //     content={props.activeNotification.message}
  //   />
  //   :
  //   null
  // }

  useEffect(() => {
    if (props.currentUser && props.activeNotification) {
      toast((t) => (
        <span className='toaster'>
          {props.activeNotification.message}
          <button className='ui button icon small' onClick={() => toast.dismiss(t.id)}>
            <Icon name='delete' />
          </button>
        </span>
      ))
    }
  }, [props.activeNotification])

  const handleClickOutside = (event) => {
		if (menuRef.current && !menuRef.current.contains(event.target) && openRef.current && !openRef.current.contains(event.target)) {
			setMobileMenuOpen(false)
		}
	}

  const renderMobileMenu = (e) => {
    setMobileMenuOpen(!mobileMenuOpen)
  } 

  const Actions = (props) => {
    const AddOrFind = (props) => {
      if (props.activeSpace) {
        return null
      }
      if (props.routerProps.location.pathname === "/add_space") {
        return (
          <Link to={"/"} className="item" >
            Find Parking Spot
          </Link>
        )
      } else {
        return (
          <Link to={"/add_space"} className="item" >
            Add Parking Spot
          </Link>
        )
      }
    }
    if (props.currentUser) {
      return (
        <Menu.Menu position='right'>
          <AddOrFind {...props} />
          <Menu.Item name='logout' onClick={() => props.logout(props.routerProps.history)}>
            Logout
          </Menu.Item>
        </Menu.Menu>
      )
    } else {
      return (
        <Menu.Menu position='right' >
          <Link to='/login' className="item">
              Login
          </Link>
          <Link to='/sign_up' className="item">
              Sign Up
          </Link>
        </Menu.Menu>
      )
    }
  }
  
  const renderNavbar = () => {
    if (props.loading) {
      return null
    } else {
      return (
        <div className="navbar" ref={openRef}>
          <Menu className={mobileMenuOpen ? 'mobile' : ''}>
            <Menu.Item className="burger-icon" onClick={renderMobileMenu} >
              <Icon name='bars'  />
            </Menu.Item>
            <div className="sub-menu" ref={menuRef}>
              {
                props.currentUser
                ?
                <>
                  { 
                    props.routerProps.location.pathname.split('/').includes("profile")
                    ?
                    <Menu.Item as={Link} to='/' >
                      <Icon name='car' />
                      Find Parking
                    </Menu.Item>
                    :
                    <Menu.Item as={Link} to='/profile' >
                      {
                        props.currentUser.user_image.content
                        ? 
                        <img className="ui avatar image" src={`data:image/jpeg;base64,${props.currentUser.user_image.content}`} />
                        :  
                        <Icon name='user' />
                      }
                      {props.currentUser.name}
                    </Menu.Item>
                  }
                </>
                :
                null
              }
              <div id="active-notification"></div>
              <Actions {...props} />
            </div>
          </Menu>
          {
            props.showNotifications && props.notifications.length
            ?
            <div className="notifications" id="showNotifications">
              <Dropdown.Menu id="showNotifications">
                {renderNotifications()}
                {
                  props.notifications.length > 1
                  ?
                  <Button  inverted color='red' onClick={() => props.deleteAllNotifications(props.currentUser.id)}>Delete All</Button>
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

  return (
    <div>
      {renderNavbar()}
    </div>
  )
}

function msp(state) {
  return {
    currentUser: state.user.currentUser,
    loading: state.map.loading,
    notifications: state.user.notifications,
    showNotifications: state.user.showNotifications,
    activeNotification: state.user.activeNotification,
    activeSpace: state.map.activeSpace
  }
}

export default connect(msp, {
  logout, 
  handleNotificationDismiss, 
  toggleShowNotifications, 
  closeActiveNotification, 
  deleteAllNotifications
})(Navbar);
