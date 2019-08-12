import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { cancelClaim, finishedParking, addSpaceAfterParking, removeSpace } from '../actions'

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
          <Link to={"/"} >
            <button
              onClick={() => props.addSpaceAfterParking(props.currentUser, props.selectedSpace.id)}>
              Add Parking Spot
            </button>
          </Link>
          <Link to={"/"} >
            <button
              onClick={() => props.removeSpace(props.selectedSpace.id)}>
              Find New Parking Spot
            </button>
          </Link>
        </>
        :
        <>
          <Link to={"/"} >
            <button
              onClick={() => props.cancelClaim(props.currentUser, props.selectedSpace.id)}>
              Cancel
            </button>
          </Link>
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
  finishedParking,
  addSpaceAfterParking,
  removeSpace
})(ActiveSpace);
