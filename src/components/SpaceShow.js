import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { 
  dispatchActiveSpace, 
  openNewChat, 
  claimSpace, 
  cancelClaim, 
  removeSpace, 
  openChat,
  addSpaceAfterParking } from '../actions/actions'
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

  renderCreatedBy(owner) {
    let createdBy;
    if (owner.id !== this.props.selectedSpace.claimer) {
      createdBy = (this.props.currentUser.id === owner.id) ? "You" : `${owner.name}`
    } else {
      return "You have parked here";
    }
    return `Created by ${createdBy}`
  }
  
  renderClaimedBy() {
    if (this.props.selectedSpace.claimed) {
      if ((this.props.selectedSpace.owner === this.props.currentUser.id) || (this.props.selectedSpace.claimer === this.props.currentUser.id)) {
        if (this.props.selectedSpace.owner !== this.props.selectedSpace.claimer) {
          if (this.props.selectedSpace.claimer === this.props.currentUser.id) {
            return <h4>Claimed By You</h4>  
          }
          return (
            <h4>
              Claimed by {this.props.users.find(user => user.id === this.props.selectedSpace.claimer).name}
            </h4>
          )
        } 
      }
    }
    return null
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
              {
                this.renderCreatedBy(owner)
              }
            </h4>
            <div className="ui small feed">
              <div className="event">
                <div className="content">
                  {
                    this.renderClaimedBy()
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
            this.props.selectedSpace.claimed 
              && this.props.selectedSpace.claimer === this.props.currentUser.id
                && this.props.selectedSpace.claimer !== this.props.selectedSpace.owner
            ?
            <button className="ui bottom attached button" onClick={this.goToActiveSpace}>
              <i className="car icon"></i>
              Continue Parking
            </button>
            :
            null
          }
          {
            this.props.selectedSpace.claimed
              && this.props.selectedSpace.claimer === this.props.selectedSpace.owner
            ?
              <button className="ui bottom attached button" onClick={() => this.props.addSpaceAfterParking(this.props.currentUser.id, this.props.selectedSpace.id)}>
              <i className="car icon"></i>
              Add Parking Spot
            </button>
              :
              null
          }
          {
            this.props.selectedSpace.claimed 
              && this.props.selectedSpace.owner === this.props.currentUser.id
                && this.props.selectedSpace.owner !== this.props.selectedSpace.claimer
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
        this.props.activeChat 
          && (this.props.activeChat === this.props.selectedSpace.id)
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
  dispatchActiveSpace,
  addSpaceAfterParking
})(SpaceShow);
