import React, { Component } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import MainContainer from './containers/MainContainer'
import Navbar from './components/Navbar'
import { connect } from 'react-redux'
import { ActionCableConsumer } from 'react-actioncable-provider'
import Cable from './components/Cable'
import { handleReceivedNotifications, closeNotifications, toggleShowNotifications } from './actions/notification'
import { dispatchSetFavorites, handleReceivedUser, fetchUsers, handleReceivedSpace, handleAutoLogin, fetchSpots, setCurrentPosition, updateTimer, fetchChats, handleReceivedMessage, handleReceivedChatroom } from './actions/actions'

class App extends Component {
  
  notificationId = 0
  mainInterval = 0
  
  async componentDidMount() {
    const token = localStorage.token
    if (token) {
      await this.props.handleAutoLogin(token)
    }
    this.props.fetchUsers()
    this.props.fetchSpots(this.props.viewport)
    this.props.dispatchSetFavorites()
    this.props.fetchChats()
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.displayLocationInfo);
    } else {
      this.props.setCurrentPosition([-74.01500, 40.705341])
    }
    
    this.mainInterval = setInterval(() => {
      this.props.updateTimer()
    }, 1000)
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
              onReceived = {(response) => this.props.handleReceivedNotifications(response)}
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
  dispatchSetFavorites,
})(App);
