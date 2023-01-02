import React, { useEffect } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import MainContainer from './containers/MainContainer'
import Navbar from './components/Navbar'
import { connect } from 'react-redux'
import { handleReceivedNotifications, closeNotifications, toggleShowNotifications } from './actions/notification'
import { dispatchSetFavorites, handleReceivedUser, toggleLoading, handleReceivedSpace, handleAutoLogin, fetchSpots, setCurrentPosition, updateTimer, fetchChats, handleReceivedMessage, handleReceivedChatroom, dispatchActiveSpace } from './actions/actions'
import _ from 'lodash';
import { Toaster } from 'react-hot-toast';

const App = (props) => {
  
  let mainInterval = 0
  
  useEffect(() => {
    const token = localStorage.token
    if (token) {
      props.handleAutoLogin(token)
    }
    props.toggleLoading()
    props.fetchSpots(props.viewport)
    props.dispatchSetFavorites()
    props.fetchChats()

    navigator.geolocation.watchPosition((position) => {
      navigator.geolocation.getCurrentPosition(displayLocationInfo);
    },
    (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        props.setCurrentPosition([-74.01500, 40.705341])
      }
    });

    mainInterval = setInterval(() => {
      props.updateTimer()
    }, 1000)

    return () => {
      clearInterval(mainInterval)
    }
  }, [])

  useEffect(() => {    
    const ChatroomSubscription = props.cable.subscriptions.create(
        {
          channel: 'ChatroomsChannel',
        },
        {
          received: (response) => props.handleReceivedChatroom(response)
        }
    )
    const NotificationSubscription = props.cable.subscriptions.create(
        {
          channel: 'NotificationsChannel',
        },
        {
          received: (response) => props.handleReceivedNotifications(response)
        }
    )
    const UsersSubscription = props.cable.subscriptions.create(
      {
        channel: 'UsersChannel',
      },
      { 
        connected: () => {
          console.log("connected!")
        },
        disconnected: () => {
          console.log("disconnected!")
        },
        received: (response) => {
          console.log("received!")
          props.handleReceivedUser(response, props.routerProps)
        }
      }
    )
    const SpacesSubscription = props.cable.subscriptions.create(
        {
          channel: 'SpacesChannel',
        },
        {
          received: (response) => props.handleReceivedSpace(response, props.routerProps, props.currentUser)
        }
    )

    return () => {
      SpacesSubscription.unsubscribe()
      UsersSubscription.unsubscribe()
      NotificationSubscription.unsubscribe()
      ChatroomSubscription.unsubscribe()
    }
  }, [props.cable.subscriptions, props.currentUser])

  useEffect(() => {
    if (props.chats.length) {
      props.chats.map(chatroom => {
        const existingChatroom = props.cable.subscriptions.subscriptions.find(subscription => JSON.parse(subscription.identifier).chatroom === chatroom.id)
        if (existingChatroom) {
          return null
        }
        return props.cable.subscriptions.create(
          {
            channel: 'MessagesChannel',
            chatroom: chatroom.id
          },
          {
            received: (response) => props.handleReceivedMessage(response)
          }
        )
      })
    }
  }, [props.chats])

  useEffect(() => {
    if (props.currentUser) {
      if (props.currentUser.claimed_spaces.length) {
        const activeSpace = props.currentUser.claimed_spaces[0]
        props.dispatchActiveSpace(activeSpace)
      }
    } 
  }, [props.currentUser])

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
      <Navbar routerProps={props.routerProps} />
      <MainContainer routerProps={props.routerProps} />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 5000
        }}
        containerStyle={{ 
          top: '50px'
        }}
      />
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
    showNotifications: state.user.showNotifications,
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
  toggleLoading,
  handleReceivedNotifications,
  toggleShowNotifications,
  closeNotifications,
  handleReceivedUser,
  dispatchSetFavorites,
  dispatchActiveSpace
})(App);
