import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import ChatTable from './ChatTable'
import { Image, Segment } from 'semantic-ui-react'
import { openSpace, openNewChat, cancelClaim, finishedParking, addSpaceAfterParking, removeSpace, toggleShowDirections, openChat } from '../actions'

class ActiveSpace extends React.Component {

  renderChat = () => {
    if (this.props.activeChat && (this.props.activeChat.space === this.props.selectedSpace.id)) {
      return <ChatTable />
    } else if (this.props.chats.find(chat => chat.space === this.props.selectedSpace.id)) {
      return <button onClick={() => this.props.openChat(this.props.selectedSpace.id)}>Continue Chat</button>
    } else {
      return <button onClick={() => this.props.openNewChat(this.props.selectedSpace.id)}>Chat</button>
    }
  }

  render(){
    if (this.props.loading) {
      return <div>loading...</div>
    } else {
      return (
        <div>
          <p>{this.props.selectedSpace.address}</p>
          {
            this.props.selectedSpace.owner !== this.props.currentUser
            ?
            <>
              <p>Created By: {this.props.users.find(user => user.id === this.props.selectedSpace.owner).name}</p>
              <p>Claimed By: {this.props.users.find(user => user.id === this.props.selectedSpace.claimer).name}</p>
              {this.renderChat()}
            </>
            :
            null
          }
          {
            this.props.selectedSpace.owner === this.props.currentUser
            ?
            <>
              <Link to={"/"} >
                <button
                  onClick={() => this.props.addSpaceAfterParking(this.props.currentUser, this.props.selectedSpace.id)}>
                  Add Parking Spot
                </button>
              </Link>
              <Link to={"/"} >
                <button
                  onClick={() => this.props.removeSpace(this.props.selectedSpace.id)}>
                  Find New Parking Spot
                </button>
              </Link>
            </>
            :
            <>
              <Link to={"/"} >
                <button
                  onClick={() => this.props.cancelClaim(this.props.currentUser, this.props.selectedSpace.id)}>
                  Cancel
                </button>
              </Link>
              <button
                onClick={() => this.props.finishedParking(this.props.currentUser, this.props.selectedSpace.id)}>
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
    selectedSpace: state.map.selectedSpace,
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
