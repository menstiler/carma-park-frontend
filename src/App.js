import React, { Component } from 'react';
import './App.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import MainContainer from './containers/MainContainer'
import Navbar from './components/Navbar'
import { connect } from 'react-redux'
import { ActionCableConsumer } from 'react-actioncable-provider'
import Cable from './components/Cable'

import { closeNotifications, toggleShowNotifications, handleReceivedNotifications, fetchNotifications, fetchUsers, handleReceivedSpace, handleAutoLogin, fetchSpots, setCurrentPosition, updateTimer, fetchChats, handleReceivedMessage, handleReceivedChatroom } from './actions'

class App extends Component {

  notificationId = 0
  mainInterval = 0

  componentDidMount() {
    const token = localStorage.token
    if (token) {
      this.props.handleAutoLogin(token)
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.displayLocationInfo);
    } else {
      this.props.setCurrentPosition([-74.01500, 40.705341])
    }
    this.props.fetchUsers()
    .then(resp => {
      this.props.fetchSpots(this.props.viewport)
    })
    this.props.fetchChats()
    this.mainInterval = setInterval(() => {
      this.props.updateTimer()
    }, 1000)
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
    if (document.querySelectorAll('.ui.message p:last-child')) {
      document.querySelectorAll('.ui.message p:last-child').forEach(node => node.setAttribute("id", "dontToggleNotifications"))
      document.querySelectorAll('#showNotifications > .close.icon').forEach(node => node.setAttribute("id", "dontToggleNotifications"))
    }
    if (this.props.currentUser) {
      this.props.fetchNotifications(this.props.currentUser)
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
        <ActionCableConsumer
          channel={{ channel: 'ChatroomsChannel' }}
          onReceived={this.props.handleReceivedChatroom}
        />
        <ActionCableConsumer
          channel={{ channel: 'NotificationsChannel' }}
          onReceived={this.props.handleReceivedNotifications}
        />
        <ActionCableConsumer
          channel={{ channel: 'SpacesChannel' }}
          onReceived={(response) =>this.props.handleReceivedSpace(response, this.props.routerProps, this.props.currentUser)}
        />
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
  fetchNotifications,
  handleReceivedNotifications,
  toggleShowNotifications,
  closeNotifications
})(App);
