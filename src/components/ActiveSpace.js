import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import ChatTable from './ChatTable'
import { openSpace, openNewChat, cancelClaim, finishedParking, addSpaceAfterParking, removeSpace, toggleShowDirections, openChat } from '../actions'

function ActiveSpace(props) {

  const renderChat = () => {
    debugger
    if (props.activeChat && (props.activeChat.space === props.selectedSpace.id)) {
      return <ChatTable />
    } else if (props.chats.find(chat => chat.space === props.selectedSpace.id)) {
      debugger
      return <button onClick={() => props.openChat(props.selectedSpace.id)}>Continue Chat</button>
    } else {
      return <button onClick={() => props.openNewChat(props.selectedSpace.id)}>Chat</button>
    }
  }

  return (
    <div>
      <p>{props.selectedSpace.address}</p>
      {
        props.selectedSpace.owner !== props.currentUser
        ?
        <>
          <p>Created By: {props.users.find(user => user.id === props.selectedSpace.owner).name}</p>
        </>
        :
        null
      }
      <p>Claimed By: {props.users.find(user => user.id === props.selectedSpace.claimer).name}</p>
      {
        renderChat()
      }
      {
        props.selectedSpace.owner === props.currentUser
        ?
        <>
          <Link to={"/"} >
            <button
              onClick={() => props.addSpaceAfterParking(props.currentUser, props.selectedSpace.id)}>
              Add Parking Spot
            </button>
          </Link>
          <Link to={"/"} >
            <button
              onClick={() => props.removeSpace(props.selectedSpace.id)}>
              Find New Parking Spot
            </button>
          </Link>
        </>
        :
        <>
          <Link to={"/"} >
            <button
              onClick={() => props.cancelClaim(props.currentUser, props.selectedSpace.id)}>
              Cancel
            </button>
          </Link>
          <button
            onClick={() => props.finishedParking(props.currentUser, props.selectedSpace.id)}>
            Parked
          </button>
          <button onClick={props.toggleShowDirections}>{props.showDirection ? "Hide Directions" : "Show Directions"}</button>
        </>
      }
    </div>
  )
}

function msp(state) {
  return {
    users: state.map.users,
    selectedSpace: state.map.selectedSpace,
    currentUser: state.user.currentUser,
    showDirection: state.map.showDirection,
    chats: state.user.chats,
    activeChat: state.user.activeChat,
  }
}

export default connect(msp, {
  cancelClaim,
  finishedParking,
  addSpaceAfterParking,
  removeSpace,
  toggleShowDirections,
  openChat,
  openSpace,
  openNewChat
})(ActiveSpace);
