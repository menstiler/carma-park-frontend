import React, { Component } from 'react';
import { connect } from 'react-redux'
import SpaceCard from '../components/SpaceCard'
import SpaceShow from '../components/SpaceShow'
import { claimSpace, filterData as filterSpaces } from '../actions/actions'


function SpacesContainer(props) {

  const renderSpaces = () => {
    let filteredSpaces = filterSpaces(props.spaces, props.currentUser)
    return filteredSpaces.map(space => <SpaceCard key={space.id} space={space} routerProps={props.routerProps} />)
  }

  return(
    <>
      <div className="space-container">
        {renderSpaces()}
      </div>
      {props.currentUser && props.selectedSpace
        ?
        <div className="space-show">
          <SpaceShow routerProps={props.routerProps} />
        </div>
        :
        null
      }
    </>
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
    distanceShow: state.form.distanceShow,
    selectedSpace: state.map.selectedSpace
  }
}

export default connect(msp, {
  claimSpace
})(SpacesContainer);
