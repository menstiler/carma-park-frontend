import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import ChatTable from './ChatTable'
import { Image, Segment, Button, Card } from 'semantic-ui-react'
import {  hideChat, openSpace, openNewChat, cancelClaim, finishedParking, removeSpace, toggleShowDirections, openChat, createSpace } from '../actions/actions'
import '../styles/activeSpace.scss';
import '../styles/loader.scss';
import Loader from './Loader'

const ActiveSpace = (props) => {
  const [parked, setParked] = useState(false)
  const activeSpace = props.activeSpace
  const image = activeSpace.image
  
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
    props.finishedParking(props.currentUser.id, activeSpace.id)
    setParked(true)
  }

  const addSpaceAfterParking = () => {
    let time = {
      minutes: 0,
      hours: 0
    }
    let { address, longitude, latitude, image } = activeSpace
    props.createSpace(props.currentUser.id, address, { longitude, latitude }, time, image )
  }
  
  
  if (props.loading) {
    return <Loader />
  } else {
    return (
      <div className={props.activeChat && (props.activeChat === activeSpace.id) ? "active-space-container double" : "active-space-container"}>
        <div className="active-space-info">
          <h3>{activeSpace.address}</h3>
          <div className='space-info'>
            {
              activeSpace.owner !== props.currentUser.id
              ?
              <div className='ui items'>
                <div className='meta'>Created by:</div>
                <div className='item'>
                  {
                    activeSpace.owner.user_image && activeSpace.owner.user_image.content 
                    ?
                    <div className='ui tiny image'>
                      <img src={`data:image/jpeg;base64,${activeSpace.owner.user_image.content}`} />  
                    </div>
                    :
                    null
                  }
                  <div className='content'>
                    <h4 className='header'>{activeSpace.owner.name}</h4>
                    <div className="meta car-info">
                      {activeSpace.owner.car_make ? <span>{activeSpace.owner.car_make}</span> : null}
                      {activeSpace.owner.car_model ? <span>{activeSpace.owner.car_model}</span> : null}
                      {activeSpace.owner.license_plate ? <span>{activeSpace.owner.license_plate}</span> : null}
                      {
                        activeSpace.owner.car_image && activeSpace.owner.car_image.content 
                        ?
                        <img className="ui avatar image" src={`data:image/jpeg;base64,${activeSpace.owner.car_image.content}`} />  
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
                    onClick={() => props.removeSpace(activeSpace.id)}>
                    Find New Parking Spot
                  </Button>
                </Link>
              </div>
              :
              <>
                {renderChat()}
                <Link to={"/"} >
                  <Button fluid
                    onClick={() => props.cancelClaim(props.currentUser.id, activeSpace.id)}>
                    Cancel
                  </Button>
                </Link>
                <Button fluid
                  onClick={handlePark}>
                  Parked
                </Button>
                <Button floated='right' onClick={props.toggleShowDirections}>{props.showDirection ? "Hide Directions" : "Show Directions"}</Button>
                <Link to={"/"} >
                  <Button floated='left'>Back</Button>
                </Link>
              </>
            }
          </div>
        </div>
        {
          props.activeChat && (props.activeChat === activeSpace.id)
          ?
          <div className="active-space-chattable">
            <ChatTable />
          </div>
          :
          null
        }
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
  createSpace
})(ActiveSpace);
