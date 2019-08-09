import React, { Component } from 'react';
import { connect } from 'react-redux'

import { showSpace, claimSpace } from '../actions'
import SpaceShow from './SpaceShow'

function SpaceCard(props) {
  return (
    <>
      <button className="accordion" onClick={() => props.showSpace(props.space)}>
        {props.space.address} - {props.users.find(user => user.id === props.space.owner).name}
      </button>
      {props.selectedSpace && props.selectedSpace.id === props.space.id
        ?
        <SpaceShow />
        :
        null
      }
    </>
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
  showSpace,
  claimSpace
})(SpaceCard);
