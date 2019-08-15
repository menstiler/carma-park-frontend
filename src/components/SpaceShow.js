import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { openNewChat, claimSpace, cancelClaim, removeSpace, openChat } from '../actions'
import ChatTable from './ChatTable'

function SpaceShow(props) {

  const claimAction = () => {
    props.claimSpace(props.currentUser, props.selectedSpace.id)
    .then(resp => {
      props.routerProps.history.push(`/spaces/${props.selectedSpace.id}`)
    })
  }

  const renderChat = () => {
    if (props.activeChat && (props.activeChat.space === props.selectedSpace.id)) {
      return <ChatTable />
    } else if (props.chats.find(chat => chat.space === props.selectedSpace.id)) {
      return <button onClick={() => props.openChat(props.selectedSpace.id)}>Continue Chat</button>
    } else {
      return <button onClick={() => props.openNewChat(props.selectedSpace.id)}>Chat</button>
    }
  }

  return (
    <div className="panel on">
        {
          !props.selectedSpace.claimed && props.selectedSpace.owner !== props.currentUser
          ?
          <button onClick={claimAction}>
            Claim
          </button>
          :
          null
        }
        {
          !props.selectedSpace.claimed && props.selectedSpace.owner === props.currentUser
          ?
          <Link to={'/'}>
            <button
              onClick={() => props.removeSpace(props.selectedSpace.id)}>
              Cancel
            </button>
          </Link>
          :
          null
        }
        {
          props.selectedSpace.claimed && props.selectedSpace.claimer === props.currentUser
          ?
          <Link to={`/spaces/${props.selectedSpace.id}`}>
            <button>
              Continue Parking
            </button>
          </Link>
          :
          null
        }
        {
          props.selectedSpace.claimed && props.selectedSpace.owner === props.currentUser
          ?
          <div>
            Claimed by {props.users.find(user => user.id === props.selectedSpace.claimer).name}
            {
              renderChat()
            }
          </div>
          :
          null
        }
    </div>
  )
}

const findActiveChatroom = (chatrooms, activeChatroom) => {
  return chatrooms.find(
    chatroom => chatroom.space === activeChatroom
  );
};

function msp(state) {
  return {
    users: state.map.users,
    selectedSpace: state.map.selectedSpace,
    currentUser: state.user.currentUser,
    chats: state.user.chats,
    activeChat: state.user.activeChat
  }
}

export default connect(msp, {
  claimSpace,
  cancelClaim,
  removeSpace,
  openChat,
  openNewChat
})(SpaceShow);
