import React, { Component } from 'react';
import { connect } from 'react-redux'
import { TOKEN } from '../vars.js'
import SpaceCard from '../components/SpaceCard'
import { claimSpace } from '../actions'


function SpacesContainer(props) {

  const renderSpaces = () => {
    let sortedSpaces = props.spaces
    if (props.distanceShow) {
      sortedSpaces = sortedSpaces.filter(space => parseInt(space.distance) <= parseInt(props.distanceShow))
    }
    let filterSpaces = sortedSpaces.filter(space => !space.claimed && space.available || (space.available && ((space.owner !== space.claimer) && ((space.owner === props.currentUser) || (space.claimer === props.currentUser)))))
    return filterSpaces.map(space => <SpaceCard key={space.id} space={space} routerProps={props.routerProps} />)
  }

  return(
    <div>
      {renderSpaces()}
    </div>
  )
}

function msp(state) {
  return {
    viewport: state.map.viewport,
    currentUser: state.user.currentUser,
    currentPosition: state.map.currentPosition,
    showPopup: state.map.showPopup,
    popupDets: state.map.popupDets,
    spaces: state.map.spaces,
    users: state.user.users,
    distanceShow: state.form.distanceShow
  }
}

export default connect(msp, {
  claimSpace
})(SpacesContainer);
