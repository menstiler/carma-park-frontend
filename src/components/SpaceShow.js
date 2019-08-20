import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { dispatchActiveSpace, openNewChat, claimSpace, cancelClaim, removeSpace, openChat } from '../actions'
import ChatTable from './ChatTable'

class SpaceShow extends Component {

  claimAction = () => {
    this.props.claimSpace(this.props.currentUser, this.props.selectedSpace.id)
  }

  renderChatButtons = () => {
    if (!this.props.activeChat || (this.props.activeChat !== this.props.selectedSpace.id)) {
      if (this.props.chats.find(chat => chat.space === this.props.selectedSpace.id)) {
        return <button class="ui button" onClick={() => this.props.openChat(this.props.selectedSpace.id)}><i class="talk icon"></i>Continue Chat</button>
      } else {
        return <button  class="ui button" onClick={() => this.props.openNewChat(this.props.selectedSpace.id)}><i class="talk icon"></i>Chat</button>
      }
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
      <>
        <div class="ui card">
          <div class="content">
            <div class="header">{this.props.selectedSpace.address}</div>
          </div>
          <div class="content">
            <h4 class="ui sub header">
              Created by
              {
                owner.id === this.props.currentUser
                ?
                " you"
                :
                ` ${owner.name}`
              }
            </h4>
            <div class="ui small feed">
              <div class="event">
                <div class="content">
                    {image
                    ?
                    <img src={image} className="parking-image" alt={this.props.selectedSpace.address} />
                    :
                    null
                    }
                  <div class="summary">
                    {
                      this.props.selectedSpace.claimed && this.props.selectedSpace.owner === this.props.currentUser
                      ?
                      <div>
                        Claimed by {this.props.users.find(user => user.id === this.props.selectedSpace.claimer).name}
                      </div>
                      :
                      null
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
          {
            this.props.selectedSpace.claimed && this.props.selectedSpace.claimer === this.props.currentUser
            ?
            <button class="ui bottom attached button" onClick={this.goToActiveSpace}>
              <i class="car icon"></i>
              Continue Parking
            </button>
            :
            null
          }
          {
            this.props.selectedSpace.claimed && this.props.selectedSpace.owner === this.props.currentUser
            ?
            this.renderChatButtons()
            :
            null
          }
          {
            !this.props.selectedSpace.claimed && this.props.selectedSpace.owner !== this.props.currentUser
            ?
              <button class="ui bottom attached button" onClick={this.claimAction}>
                <i class="car icon"></i>
                Claim
              </button>
            :
            null
          }
          {
            !this.props.selectedSpace.claimed && this.props.selectedSpace.owner === this.props.currentUser
            ?
            <Link to={'/'}>
              <div class="ui bottom attached button" onClick={() => this.props.removeSpace(this.props.selectedSpace.id)}>
                  <i class="trash alternate outline icon"></i>
                  Cancel
              </div>
            </Link>
            :
            null
          }
        </div>
      {
        this.props.activeChat && (this.props.activeChat === this.props.selectedSpace.id)
        ?
        <ChatTable />
        :
        null
      }
    </>
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
