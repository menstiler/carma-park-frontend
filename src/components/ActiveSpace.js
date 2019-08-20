import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import ChatTable from './ChatTable'
import { Image, Segment, Button, Card } from 'semantic-ui-react'
import {  hideChat, openSpace, openNewChat, cancelClaim, finishedParking, addSpaceAfterParking, removeSpace, toggleShowDirections, openChat } from '../actions'

class ActiveSpace extends React.Component {

  renderChat = () => {
    if (!this.props.activeChat) {
      if (this.props.chats.find(chat => chat.space === this.props.activeSpace.id)) {
        return <Button fluid onClick={() => this.props.openChat(this.props.activeSpace.id)}>Continue Chat</Button>
      } else {
        return <Button fluid onClick={() => this.props.openNewChat(this.props.activeSpace.id)}>Chat</Button>
      }
    } else if (this.props.activeChat && (this.props.activeChat === this.props.activeSpace.id)) {
      return <Button fluid onClick={() => this.props.hideChat(this.props.activeSpace.id)}>Hide Chat</Button>
    }
  }

  render(){
    const image = this.props.activeSpace.image
    if (this.props.loading) {
      return <div>loading...</div>
    } else {
      return (
      <div className={this.props.activeChat && (this.props.activeChat === this.props.activeSpace.id) ? "active-space-container double" : "active-space-container"}>
        <div className="active-space-info">
          <h3>{this.props.activeSpace.address}</h3>
          {
            this.props.activeSpace.owner !== this.props.currentUser
            ?
            <>
              <h5>Created By: {this.props.users.find(user => user.id === this.props.activeSpace.owner).name}</h5>
              <h5>Claimed By: {this.props.users.find(user => user.id === this.props.activeSpace.claimer).name}</h5>
              {image
              ?
              <Card raised image={image} />
              :
              null
              }
              {this.renderChat()}
            </>
            :
            null
          }
          {
            this.props.activeSpace.owner === this.props.currentUser
            ?
            <>
              <Link to={"/"} >
                <Button fluid
                  onClick={() => this.props.addSpaceAfterParking(this.props.currentUser, this.props.activeSpace.id)}>
                  Add Parking Spot
                </Button>
              </Link>
              <Link to={"/"} >
                <Button fluid
                  onClick={() => this.props.removeSpace(this.props.activeSpace.id)}>
                  Find New Parking Spot
                </Button>
              </Link>
            </>
            :
            <>
              <Link to={"/"} >
                <Button fluid
                  onClick={() => this.props.cancelClaim(this.props.currentUser, this.props.activeSpace.id)}>
                  Cancel
                </Button>
              </Link>
              <Button fluid
                onClick={() => this.props.finishedParking(this.props.currentUser, this.props.activeSpace.id)}>
                Parked
              </Button>
              <Button floated='right' onClick={this.props.toggleShowDirections}>{this.props.showDirection ? "Hide Directions" : "Show Directions"}</Button>
              <Link to={"/"} >
                <Button floated='left'>Back</Button>
              </Link>
            </>
          }
        </div>
        {
          this.props.activeChat && (this.props.activeChat === this.props.activeSpace.id)
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
}

function msp(state) {
  return {
    users: state.user.users,
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
  addSpaceAfterParking,
  removeSpace,
  toggleShowDirections,
  openChat,
  openSpace,
  openNewChat,
  hideChat,
})(ActiveSpace);
