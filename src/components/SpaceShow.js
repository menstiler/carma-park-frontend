import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { dispatchActiveSpace, openNewChat, claimSpace, cancelClaim, removeSpace, openChat } from '../actions'
import ChatTable from './ChatTable'
import { Card } from 'semantic-ui-react'

class SpaceShow extends Component {

  claimAction = () => {
    this.props.claimSpace(this.props.currentUser.id, this.props.selectedSpace.id)
  }

  renderChatButtons = () => {
    if (!this.props.activeChat || (this.props.activeChat !== this.props.selectedSpace.id)) {
      if (this.props.chats.find(chat => chat.space === this.props.selectedSpace.id)) {
        return <button className="ui button" onClick={() => this.props.openChat(this.props.selectedSpace.id)}><i className="talk icon"></i>Continue Chat</button>
      } else {
        return <button  className="ui button" onClick={() => this.props.openNewChat(this.props.selectedSpace.id, this.props.currentUser.id)}><i className="talk icon"></i>Chat</button>
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
        <div className="ui card">
          <div className="content">
            <div className="header">{this.props.selectedSpace.address}</div>
          </div>
          <div className="content">
            <h4 className="ui sub header">
              Created by
              {
                owner.id === this.props.currentUser.id
                ?
                " you"
                :
                ` ${owner.name}`
              }
            </h4>
            <div className="ui small feed">
              <div className="event">
                <div className="content">
                  {
                    this.props.selectedSpace.claimed && this.props.selectedSpace.owner === this.props.currentUser.id
                    ?
                    <h4>
                      Claimed by {this.props.users.find(user => user.id === this.props.selectedSpace.claimer).name}
                    </h4>
                    :
                    null
                  }
                  {image
                  ?
                  <Card raised image={image} className="parking-image" alt={this.props.selectedSpace.address} />
                  :
                  null
                  }
                  <div className="summary">
                  </div>
                </div>
              </div>
            </div>
          </div>
          {
            this.props.selectedSpace.claimed && this.props.selectedSpace.claimer === this.props.currentUser.id
            ?
            <button className="ui bottom attached button" onClick={this.goToActiveSpace}>
              <i className="car icon"></i>
              Continue Parking
            </button>
            :
            null
          }
          {
            this.props.selectedSpace.claimed && this.props.selectedSpace.owner === this.props.currentUser.id
            ?
            this.renderChatButtons()
            :
            null
          }
          {
            !this.props.selectedSpace.claimed && this.props.selectedSpace.owner !== this.props.currentUser.id
            ?
              <button className="ui bottom attached button" onClick={this.claimAction}>
                <i className="car icon"></i>
                Claim
              </button>
            :
            null
          }
          {
            !this.props.selectedSpace.claimed && this.props.selectedSpace.owner === this.props.currentUser.id
            ?
            <Link to={'/'}>
              <div className="ui bottom attached button" onClick={() => this.props.removeSpace(this.props.selectedSpace.id)}>
                  <i className="trash alternate outline icon"></i>
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
