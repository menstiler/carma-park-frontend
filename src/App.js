import React, { Component } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import MainContainer from './containers/MainContainer'
import Navbar from './components/Navbar'
import { connect } from 'react-redux'
import { ActionCableConsumer } from 'react-actioncable-provider'
import Cable from './components/Cable'
import { dispatchSetFavorites, handleReceivedUser, closeNotifications, toggleShowNotifications, handleReceivedNotifications, fetchUsers, handleReceivedSpace, handleAutoLogin, fetchSpots, setCurrentPosition, updateTimer, fetchChats, handleReceivedMessage, handleReceivedChatroom } from './actions'

class App extends Component {

  notificationId = 0
  mainInterval = 0

  componentDidMount() {
    const token = localStorage.token
    if (token) {
      this.props.handleAutoLogin(token)
      // .then(() => this.props.fetchNotifications(this.props.currentUser.id))
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.displayLocationInfo);
    } else {
      this.props.setCurrentPosition([-74.01500, 40.705341])
    }
    this.props.fetchUsers()
    .then(resp => {
      this.props.fetchSpots(this.props.viewport)
      .then(() => this.props.dispatchSetFavorites())
    })
    this.props.fetchChats()
    this.mainInterval = setInterval(() => {
      this.props.updateTimer()
    }, 1000)

    // toggle notification tab
    document.addEventListener('click', (e) => {
      if (e.target.id) {
        if ((e.target.id === 'toggleNotifications') && this.props.showNotifications) {
          this.props.closeNotifications()
        } else if ((e.target.id === 'toggleNotifications') && !this.props.showNotifications || (e.target.id === "dontToggleNotifications")) {
          this.props.toggleShowNotifications()
        }
      } else {
        this.props.closeNotifications()
      }
    })
  }

  componentDidUpdate() {
    // check status of notification tab display
    if (document.querySelectorAll('.ui.message p:last-child')) {
      document.querySelectorAll('.ui.message p:last-child').forEach(node => node.setAttribute("id", "dontToggleNotifications"))
      document.querySelectorAll('#showNotifications > .close.icon').forEach(node => node.setAttribute("id", "dontToggleNotifications"))
    }
  }

  componentWillUnmount() {
    clearInterval(this.mainInterval)
    clearInterval(this.notificationInterval)
  }

  displayLocationInfo = (position) => {
    const lng = position.coords.longitude;
    const lat = position.coords.latitude;
    this.props.setCurrentPosition([lng, lat])
  }

  render() {
    return (
      <>
        {
          this.props.currentUser
          ?
          <>
            <ActionCableConsumer
              channel={{ channel: 'ChatroomsChannel' }}
              onReceived={this.props.handleReceivedChatroom}
            />
            <ActionCableConsumer
              channel={{ channel: 'NotificationsChannel' }}
              onReceived = {
                (response) => this.props.handleReceivedNotifications(response)
              }
            />
            <ActionCableConsumer
              channel={{ channel: 'SpacesChannel' }}
              onReceived={(response) => this.props.handleReceivedSpace(response, this.props.routerProps, this.props.currentUser)}
            />
            <ActionCableConsumer
              channel={{ channel: 'UsersChannel' }}
              onReceived={(response) => this.props.handleReceivedUser(response, this.props.routerProps, this.props.currentUser)}
            />
          </>
          :
          null
        }
        {this.props.chats.length ? (
          <Cable
          chatrooms={this.props.chats}
          handleReceivedMessage={this.props.handleReceivedMessage}
          />
        ) : null}
        <Navbar routerProps={this.props.routerProps} />
        <MainContainer routerProps={this.props.routerProps} />
      </>
    );
  }
}

function msp(state) {
  return {
    spots: state.map.spots,
    currentPosition: state.map.currentPosition,
    timer: state.user.timer,
    chats: state.user.chats,
    currentUser: state.user.currentUser,
    viewport: state.map.viewport,
    showNotifications: state.user.showNotifications
  }
}

export default connect(msp, {
  fetchSpots,
  setCurrentPosition,
  updateTimer,
  fetchChats,
  handleReceivedMessage,
  handleReceivedChatroom,
  handleAutoLogin,
  handleReceivedSpace,
  fetchUsers,
  handleReceivedNotifications,
  toggleShowNotifications,
  closeNotifications,
  handleReceivedUser,
  dispatchSetFavorites
})(App);
