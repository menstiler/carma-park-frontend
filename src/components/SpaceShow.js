import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { openNewChat, claimSpace, cancelClaim, removeSpace, openChat } from '../actions'
import ChatTable from './ChatTable'

class SpaceShow extends React.Component {

  claimAction = () => {
    this.props.claimSpace(this.props.currentUser, this.props.selectedSpace.id)
  }

  renderChat = () => {
    if (this.props.activeChat && (this.props.activeChat === this.props.selectedSpace.id)) {
      return <ChatTable />
    } else if (this.props.chats.find(chat => chat.space === this.props.selectedSpace.id)) {
      return <button onClick={() => this.props.openChat(this.props.selectedSpace.id)}>Continue Chat</button>
    } else {
      return <button onClick={() => this.props.openNewChat(this.props.selectedSpace.id)}>Chat</button>
    }
  }

  render() {
  return (
    <div className="panel on">
        {
          !this.props.selectedSpace.claimed && this.props.selectedSpace.owner !== this.props.currentUser
          ?
          <button onClick={this.claimAction}>
            Claim
          </button>
          :
          null
        }
        {
          !this.props.selectedSpace.claimed && this.props.selectedSpace.owner === this.props.currentUser
          ?
          <Link to={'/'}>
            <button
              onClick={() => this.props.removeSpace(this.props.selectedSpace.id)}>
              Cancel
            </button>
          </Link>
          :
          null
        }
        {
          this.props.selectedSpace.claimed && this.props.selectedSpace.claimer === this.props.currentUser
          ?
          <Link to={`/spaces/${this.props.selectedSpace.id}`}>
            <button>
              Continue Parking
            </button>
          </Link>
          :
          null
        }
        {
          this.props.selectedSpace.claimed && this.props.selectedSpace.owner === this.props.currentUser
          ?
          <div>
            Claimed by {this.props.users.find(user => user.id === this.props.selectedSpace.claimer).name}
            {
              this.renderChat()
            }
          </div>
          :
          null
        }
    </div>
  )
}
}

const findActiveChatroom = (chatrooms, activeChatroom) => {
  return chatrooms.find(
    chatroom => chatroom.space === activeChatroom
  );
};

function msp(state) {
  return {
    users: state.user.users,
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
