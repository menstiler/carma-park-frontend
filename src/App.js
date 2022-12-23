import React, { useEffect } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import MainContainer from './containers/MainContainer'
import Navbar from './components/Navbar'
import { connect } from 'react-redux'
import { ActionCableConsumer } from 'react-actioncable-provider'
import Cable from './components/Cable'
import { handleReceivedNotifications, closeNotifications, toggleShowNotifications } from './actions/notification'
import { dispatchSetFavorites, handleReceivedUser, fetchUsers, handleReceivedSpace, handleAutoLogin, fetchSpots, setCurrentPosition, updateTimer, fetchChats, handleReceivedMessage, handleReceivedChatroom } from './actions/actions'
import _ from 'lodash';

const App = (props) => {
  
  let mainInterval = 0
  
  useEffect(() => {
    const token = localStorage.token
    if (token) {
      props.handleAutoLogin(token)
    }
    props.fetchUsers()
    props.fetchSpots(props.viewport)
    props.dispatchSetFavorites()
    props.fetchChats()
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(displayLocationInfo);
    } else {
      props.setCurrentPosition([-74.01500, 40.705341])
    }
    
    mainInterval = setInterval(() => {
      props.updateTimer()
    }, 1000)

    return () => {
      clearInterval(mainInterval)
    }
  }, [])

  const displayLocationInfo = async (position) => {
    const lng = position.coords.longitude;
    const lat = position.coords.latitude;
    let res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?country=US&access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`)
    .then(res => res.json())
    .then(geocodeResult => {
      let address = _.find(geocodeResult.features, ['place_type', ['address']]).place_name;
      props.setCurrentPosition([lng, lat, address])
    })
  }

  return (
    <>
      {
        props.currentUser
        ?
        <>
          <ActionCableConsumer
            channel={{ channel: 'ChatroomsChannel' }}
            onReceived={props.handleReceivedChatroom}
          />
          <ActionCableConsumer
            channel={{ channel: 'NotificationsChannel' }}
            onReceived = {(response) => props.handleReceivedNotifications(response)}
          />
          <ActionCableConsumer
            channel={{ channel: 'SpacesChannel' }}
            onReceived={(response) => props.handleReceivedSpace(response, props.routerProps, props.currentUser)}
          />
          <ActionCableConsumer
            channel={{ channel: 'UsersChannel' }}
            onReceived={(response) => props.handleReceivedUser(response, props.routerProps, props.currentUser)}
          />
        </>
        :
        null
      }
      {props.chats.length ? (
        <Cable
          chatrooms={props.chats}
          handleReceivedMessage={props.handleReceivedMessage}
        />
      ) : null}
      <Navbar routerProps={props.routerProps} />
      <MainContainer routerProps={props.routerProps} />
    </>
  );
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
