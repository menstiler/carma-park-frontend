import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import ChatTable from './ChatTable'
import { Button } from 'semantic-ui-react'
import {  hideChat, openSpace, openNewChat, cancelClaim, finishedParking, removeSpace, toggleShowDirections, openChat, createSpace, dispatchActiveSpace } from '../actions/actions'
import '../styles/activeSpace.scss';
import '../styles/loader.scss';
import Loader from './Loader'
import Map from '../components/Map'

const ActiveSpace = (props) => {
  const [parked, setParked] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (props.currentUser) {
      const space = props.currentUser.claimed_spaces.find(space => space.id === props.activeSpace.id)
      if (space) {
        if (space.owner_id === space.claimer_id) {
          setParked(true)
        }
        props.dispatchActiveSpace(space)
      } 
    }
    setLoading(false)
  }, [props.currentUser])

  const renderChat = () => {
    if (parked) return
    if (!props.activeChat) {
      if (props.chats.find(chat => chat.space === props.activeSpace.id)) {
        return <Button fluid onClick={() => props.openChat(props.activeSpace.id)}>Continue Chat</Button>
      } else {
        return <Button fluid onClick={() => props.openNewChat(props.activeSpace.id, props.currentUser.id)}>Chat</Button>
      }
    } else if (props.activeChat && (props.activeChat === props.activeSpace.id)) {
      return <Button fluid onClick={() => props.hideChat(props.activeSpace.id)}>Hide Chat</Button>
    } else {
      return <Button fluid onClick={() => props.openNewChat(props.activeSpace.id, props.currentUser.id)}>Chat</Button>
    }
  }

  const handlePark = () => {
    props.finishedParking(props.currentUser.id, props.activeSpace.id)
    setParked(true)
  }

  const cancelClaim = () => {
    props.cancelClaim(props.currentUser.id, props.activeSpace.id)
  }
  
  const addSpaceAfterParking = () => {
    let time = {
      minutes: 0,
      hours: 0
    }
    let { address, longitude, latitude, image } = props.activeSpace
    props.createSpace(props.currentUser.id, address, { longitude, latitude }, time, image )
  }
  
  if (loading) {
    return <Loader />
  } else if (!props.activeSpace) {
    return (
      <div className='alert container'>
        <h3 className='ui warning message'>There seems to have been an issue, please try refreshing the page.</h3>
      </div>
    ) 
  } else {
    return (
      <div className="action-container">
        <div className={props.activeChat && (props.activeChat === props.activeSpace.id) ? "active-space-container double" : "active-space-container"}>
          <div className="active-space-info">
            <h3>{props.activeSpace.address}</h3>
            <div className='space-info'>
              {
                props.activeSpace.owner !== props.currentUser.id
                ?
                <div className='ui items'>
                  <div className='meta'>Created by:</div>
                  <div className='item'>
                    {
                      props.activeSpace.owner.user_image && props.activeSpace.owner.user_image.content 
                      ?
                      <div className='ui tiny image'>
                        <img src={`data:image/jpeg;base64,${props.activeSpace.owner.user_image.content}`} />  
                      </div>
                      :
                      null
                    }
                    <div className='content'>
                      <h4 className='header'>{props.activeSpace.owner.name}</h4>
                      <div className="meta car-info">
                        {props.activeSpace.owner.car_make ? <span>{props.activeSpace.owner.car_make}</span> : null}
                        {props.activeSpace.owner.car_model ? <span>{props.activeSpace.owner.car_model}</span> : null}
                        {props.activeSpace.owner.license_plate ? <span>{props.activeSpace.owner.license_plate}</span> : null}
                        {
                          props.activeSpace.owner.car_image && props.activeSpace.owner.car_image.content 
                          ?
                          <img className="ui avatar image" src={`data:image/jpeg;base64,${props.activeSpace.owner.car_image.content}`} />  
                          :
                          null
                        }
                      </div>
                    </div>
                  </div>
                </div>
                :
                null
              }
            </div>
            <div className='action-btns'>
              {
                parked
                ?
                <div className="parked-buttons">
                  <Link to={"/"} >
                    <Button fluid
                      onClick={addSpaceAfterParking}>
                      Add Parking Spot
                    </Button>
                  </Link>
                  <Link to={"/"} >
                    <Button fluid
                      onClick={() => props.removeSpace(props.activeSpace.id)}>
                      Find New Parking Spot
                    </Button>
                  </Link>
                </div>
                :
                <>
                  {renderChat()}
                  <Link to={"/"} >
                    <Button fluid
                      onClick={cancelClaim}>
                      Cancel
                    </Button>
                  </Link>
                  <Button fluid
                    onClick={handlePark}>
                    Parked
                  </Button>
                  <Button floated='right' onClick={props.toggleShowDirections}>{props.showDirection ? "Hide Directions" : "Show Directions"}</Button>
                </>
              }
            </div>
          </div>
          {
            props.activeChat && (props.activeChat === props.activeSpace.id)
            ?
            <div className="active-space-chattable">
              <ChatTable />
            </div>
            :
            null
          }
        </div>
        <div className="map-container">
          <Map />
        </div>
      </div>
     )
  }
}

function msp(state) {
  return {
    activeSpace: state.map.activeSpace,
    currentUser: state.user.currentUser,
    showDirection: state.map.showDirection,
    chats: state.user.chats,
    activeChat: state.user.activeChat,
    loading: state.map.loading,
  }
}

export default connect(msp, {
  cancelClaim,
  finishedParking,
  removeSpace,
  toggleShowDirections,
  openChat,
  openSpace,
  openNewChat,
  hideChat,
  createSpace,
  dispatchActiveSpace
})(ActiveSpace);
