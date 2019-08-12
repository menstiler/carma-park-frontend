import React, { Component } from 'react';
import { connect } from 'react-redux'
import { TOKEN } from '../vars.js'
import SpaceCard from '../components/SpaceCard'
// import actions!
import { claimSpace } from '../actions'

function SpacesContainer(props) {

  const renderSpaces = () => {
    // let filterSpaces1 = props.spaces.filter(space => (parseFloat(space.longitude) < props.mapBounds._ne.lng) && (parseFloat(space.longitude) > props.mapBounds._sw.lng) && (space => parseFloat(space.latitude) < props.mapBounds._ne.lat && parseFloat(space.latitude) > props.mapBounds._sw.lat))
    let filterSpaces = props.spaces.filter(space => !space.claimed && space.available || (space.available && ((space.owner !== space.claimer) && ((space.owner === props.currentUser) || (space.claimer === props.currentUser)))))
    return filterSpaces.map(space => <SpaceCard key={space.id} space={space} routerProps={props.routerProps} />)
  }

  return(
    <div>
      {renderSpaces()}
    </div>
  )
}

// list all state attributes to use as props in the component
function msp(state) {
  return {
    viewport: state.map.viewport,
    currentUser: state.user.currentUser,
    currentPosition: state.map.currentPosition,
    showPopup: state.map.showPopup,
    popupDets: state.map.popupDets,
    spaces: state.map.spaces,
    users: state.map.users,
    mapBounds: state.map.mapBounds
  }
}

// add msp to map state to props as first argument (or null), then map dispatch actions as second argument
export default connect(msp, {
  claimSpace
})(SpacesContainer);

export {
  SpacesContainer
};
