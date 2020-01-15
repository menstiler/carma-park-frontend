import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import ChatTable from './ChatTable'
import { Image, Segment, Button, Card } from 'semantic-ui-react'
import {  hideChat, openSpace, openNewChat, cancelClaim, finishedParking, addSpaceAfterParking, removeSpace, toggleShowDirections, openChat } from '../actions'
import '../styles/activeSpace.scss';
import '../styles/loader.scss';

class ActiveSpace extends React.Component {

  renderChat = () => {
    if (!this.props.activeChat) {
      if (this.props.chats.find(chat => chat.space === this.props.activeSpace.id)) {
        return <Button fluid onClick={() => this.props.openChat(this.props.activeSpace.id)}>Continue Chat</Button>
      } else {
        return <Button fluid onClick={() => this.props.openNewChat(this.props.activeSpace.id, this.props.currentUser)}>Chat</Button>
      }
    } else if (this.props.activeChat && (this.props.activeChat === this.props.activeSpace.id)) {
      return <Button fluid onClick={() => this.props.hideChat(this.props.activeSpace.id)}>Hide Chat</Button>
    } else {
      return <Button fluid onClick={() => this.props.openNewChat(this.props.activeSpace.id, this.props.currentUser)}>Chat</Button>
    }
  }

  render(){
    const image = this.props.activeSpace.image
    if (this.props.loading) {
      return (
        <div className="loader">
          <svg className="car" width="102" height="40" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(2 1)" stroke="#808080" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">
              <path className="car__body" d="M47.293 2.375C52.927.792 54.017.805 54.017.805c2.613-.445 6.838-.337 9.42.237l8.381 1.863c2.59.576 6.164 2.606 7.98 4.531l6.348 6.732 6.245 1.877c3.098.508 5.609 3.431 5.609 6.507v4.206c0 .29-2.536 4.189-5.687 4.189H36.808c-2.655 0-4.34-2.1-3.688-4.67 0 0 3.71-19.944 14.173-23.902zM36.5 15.5h54.01" stroke-width="3"/>
              <ellipse className="car__wheel--left" stroke-width="3.2" fill="#FFF" cx="83.493" cy="30.25" rx="6.922" ry="6.808"/>
              <ellipse className="car__wheel--right" stroke-width="3.2" fill="#FFF" cx="46.511" cy="30.25" rx="6.922" ry="6.808"/>
              <path className="car__line car__line--top" d="M22.5 16.5H2.475" stroke-width="3"/>
              <path className="car__line car__line--middle" d="M20.5 23.5H.4755" stroke-width="3"/>
              <path className="car__line car__line--bottom" d="M25.5 9.5h-19" stroke-width="3"/>
            </g>
          </svg>
        </div>
      )
    } else {
      return (
      <div className={this.props.activeChat && (this.props.activeChat === this.props.activeSpace.id) ? "active-space-container double" : "active-space-container"}>
        <div className="active-space-info">
          <h3>{this.props.activeSpace.address}</h3>
          {
            this.props.activeSpace.owner !== this.props.currentUser
            ?
            <>
              <h4>Created By: {this.props.users.find(user => user.id === this.props.activeSpace.owner).name}</h4>
              <p>Claimed By: {this.props.users.find(user => user.id === this.props.activeSpace.claimer).name}</p>
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
            <div className="parked-buttons">
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
            </div>
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
