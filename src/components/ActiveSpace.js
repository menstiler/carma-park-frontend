import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import ChatTable from './ChatTable'
import { Image, Segment } from 'semantic-ui-react'
import { openSpace, openNewChat, cancelClaim, finishedParking, addSpaceAfterParking, removeSpace, toggleShowDirections, openChat } from '../actions'

class ActiveSpace extends React.Component {

  renderChat = () => {
    if (this.props.activeChat && (this.props.activeChat === this.props.activeSpace.id)) {
      return <ChatTable />
    } else if (this.props.chats.find(chat => chat.space === this.props.activeSpace.id)) {
      return <button onClick={() => this.props.openChat(this.props.activeSpace.id)}>Continue Chat</button>
    } else {
      return <button onClick={() => this.props.openNewChat(this.props.activeSpace.id)}>Chat</button>
    }
  }

  render(){
    const image = this.props.activeSpace.image
    if (this.props.loading) {
      return <div>loading...</div>
    } else {
      return (
        <div>
          <h3>{this.props.activeSpace.address}</h3>
          {
            this.props.activeSpace.owner !== this.props.currentUser
            ?
            <>
              <h5>Created By: {this.props.users.find(user => user.id === this.props.activeSpace.owner).name}</h5>
              <h5>Claimed By: {this.props.users.find(user => user.id === this.props.activeSpace.claimer).name}</h5>
              {image
              ?
              <img src={image} style={{width: '300px'}} />
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
                <button
                  onClick={() => this.props.addSpaceAfterParking(this.props.currentUser, this.props.activeSpace.id)}>
                  Add Parking Spot
                </button>
              </Link>
              <Link to={"/"} >
                <button
                  onClick={() => this.props.removeSpace(this.props.activeSpace.id)}>
                  Find New Parking Spot
                </button>
              </Link>
            </>
            :
            <>
              <Link to={"/"} >
                <button
                  onClick={() => this.props.cancelClaim(this.props.currentUser, this.props.activeSpace.id)}>
                  Cancel
                </button>
              </Link>
              <button
                onClick={() => this.props.finishedParking(this.props.currentUser, this.props.activeSpace.id)}>
                Parked
              </button>
              <button onClick={this.props.toggleShowDirections}>{this.props.showDirection ? "Hide Directions" : "Show Directions"}</button>
            </>
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
    loading: state.map.loading
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
