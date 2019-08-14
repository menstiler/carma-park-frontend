import React, { Component } from 'react';
import './App.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import MainContainer from './containers/MainContainer'
import Navbar from './components/Navbar'
import { connect } from 'react-redux'
import { ActionCable } from 'react-actioncable-provider'
import Cable from './components/Cable'

import { fetchSpots, setCurrentPosition, updateTimer, fetchChats, handleReceivedMessage, handleReceivedChatroom } from './actions'

let mainInterval

class App extends Component {

  componentDidMount() {
    this.props.fetchSpots(this.props.currentPosition)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.displayLocationInfo);
    } else {
      this.props.setCurrentPosition([-74.01500, 40.705341])
    }
    this.props.fetchChats()
    mainInterval = setInterval(() => {
      this.props.updateTimer()
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(mainInterval)
  }

  displayLocationInfo = (position) => {
    const lng = position.coords.longitude;
    const lat = position.coords.latitude;
    this.props.setCurrentPosition([lng, lat])
  }

  render() {
    return (
      <>
        <ActionCable
          channel={{ channel: 'ChatroomsChannel' }}
          onReceived={this.props.handleReceivedChatroom}
        />
        {this.props.chats.length ? (
          <Cable
          chatrooms={this.props.chats}
          handleReceivedMessage={this.props.handleReceivedMessage}
          />
        ) : null}
        <Navbar />
        <MainContainer />
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
  }
}

export default connect(msp, {
  fetchSpots,
  setCurrentPosition,
  updateTimer,
  fetchChats,
  handleReceivedMessage,
  handleReceivedChatroom,
})(App);
