import React, { Component } from 'react';
import { connect } from 'react-redux'
import { TOKEN } from '../vars.js'
import SpaceCard from '../components/SpaceCard'
// import actions!
import { claimSpace } from '../actions'

function SpacesContainer(props) {

  const renderSpaces = () => {
    let filterSpaces = props.spaces.filter(space => space.owner)
    return filterSpaces.map(space => <SpaceCard key={space.id} space={space} />)
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
    currentPosition: state.map.currentPosition,
    showPopup: state.map.showPopup,
    popupDets: state.map.popupDets,
    spaces: state.map.spaces,
    users: state.map.users,
  }
}

// add msp to map state to props as first argument (or null), then map dispatch actions as second argument
export default connect(msp, {
  claimSpace
})(SpacesContainer);

export {
  SpacesContainer
};
