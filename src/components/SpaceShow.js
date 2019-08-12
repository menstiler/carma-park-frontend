import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { claimSpace, cancelClaim, removeSpace } from '../actions'

function SpaceShow(props) {

  const claimAction = () => {
    props.claimSpace(props.currentUser, props.selectedSpace.id)
    .then(resp => {
      props.routerProps.history.push(`/spaces/${props.selectedSpace.id}`)
    })
  }

  return (
    <div className="panel on">
        {
          !props.selectedSpace.claimed && props.selectedSpace.owner !== props.currentUser
          ?
          <button onClick={claimAction}>
            Claim
          </button>
          :
          null
        }
        {
          !props.selectedSpace.claimed && props.selectedSpace.owner === props.currentUser
          ?
          <Link to={'/'}>
            <button
              onClick={() => props.removeSpace(props.selectedSpace.id)}>
              Cancel
            </button>
          </Link>
          :
          null
        }
        {
          props.selectedSpace.claimed && props.selectedSpace.claimer === props.currentUser
          ?
          <Link to={`/spaces/${props.selectedSpace.id}`}>
            <button>
              Continue Parking
            </button>
          </Link>
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
  cancelClaim,
  removeSpace
})(SpaceShow);
