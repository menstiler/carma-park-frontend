import React, { Component } from 'react';
import { connect } from 'react-redux'

import { claimSpace, cancelClaim } from '../actions'

function SpaceShow(props) {
  return (
    <div className="panel on">
        {
          !props.selectedSpace.claimed && props.selectedSpace.owner !== props.currentUser
          ?
          <button
            onClick={() => props.claimSpace(props.currentUser, props.selectedSpace.id)}>
            Claim
          </button>
          :
          null
        }
        {
          !props.selectedSpace.claimed && props.selectedSpace.owner === props.currentUser
          ?
          <button
            onClick={() => props.cancelSpace(props.currentUser, props.selectedSpace.id)}>
            Cancel
          </button>
          :
          null
        }
        {
          props.selectedSpace.claimed && props.selectedSpace.claimer === props.currentUser
          ?
          <button
            onClick={() => props.cancelClaim(props.currentUser, props.selectedSpace.id)}>
            Cancel
          </button>
          :
          null
        }
        {
          props.selectedSpace.claimed && props.selectedSpace.owner === props.currentUser
          ?
          <div>
            Claimed by {props.users.find(user => user.id === props.selectedSpace.claimer).name}
          </div>
          :
          null
        }
    </div>
  )
}

function msp(state) {
  return {
    users: state.map.users,
    selectedSpace: state.map.selectedSpace,
    currentUser: state.user.currentUser
  }
}

export default connect(msp, {
  claimSpace,
  cancelClaim
})(SpaceShow);
