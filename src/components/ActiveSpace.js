import React from 'react'
import { connect } from 'react-redux'

import { cancelClaim, finishedParking } from '../actions'

function ActiveSpace(props) {
  return (
    <div>
      <p>{props.selectedSpace.address}</p>
      {
        props.selectedSpace.owner !== props.currentUser
        ?
        <p>Created By: {props.users.find(user => user.id === props.selectedSpace.owner).name}</p>
        :
        null
      }
      <p>Claimed By: {props.users.find(user => user.id === props.selectedSpace.claimer).name}</p>
      {
        props.selectedSpace.owner === props.currentUser
        ?
        <>
          <button
            onClick={() => props.addSpaceAfterPark(props.currentUser, props.selectedSpace.id)}>
            Add Parking Spot
          </button>
          <button
            onClick={() => props.addSpaceAfterPark(props.currentUser, props.selectedSpace.id)}>
            Find New Parking Spot
          </button>
        </>
        :
        <>
          <button
            onClick={() => props.cancelClaim(props.currentUser, props.selectedSpace.id)}>
            Cancel
          </button>
          <button
            onClick={() => props.finishedParking(props.currentUser, props.selectedSpace.id)}>
            Parked
          </button>
        </>
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
  cancelClaim,
  finishedParking
})(ActiveSpace);
