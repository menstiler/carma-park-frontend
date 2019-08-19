import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { dispatchActiveSpace, openNewChat, claimSpace, cancelClaim, removeSpace, openChat } from '../actions'
import ChatTable from './ChatTable'

class SpaceShow extends Component {

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

  goToActiveSpace = () => {
    this.props.dispatchActiveSpace(this.props.selectedSpace)
    this.props.routerProps.history.push(`/spaces/${this.props.selectedSpace.id}`)
  }

   render() {

    const owner = this.props.users.find(user => user.id === this.props.selectedSpace.owner)
    const image = this.props.selectedSpace.image
    return (
      <div className="panel on">
        <h3>{this.props.selectedSpace.address}</h3>
        <h5>Created by {owner.name}</h5>
        {image
        ?
        <img src={image} style={{width: '300px'}} alt={this.props.selectedSpace.address} />
        :
        null
        }
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
          <button onClick={this.goToActiveSpace}>
            Continue Parking
          </button>
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
  openNewChat,
  dispatchActiveSpace
})(SpaceShow);
