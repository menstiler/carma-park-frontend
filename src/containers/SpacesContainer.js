import React, { Component } from 'react';
import { connect } from 'react-redux'
import SpaceCard from '../components/SpaceCard'
import SpaceShow from '../components/SpaceShow'
import { claimSpace } from '../actions'


function SpacesContainer(props) {

  const renderSpaces = () => {
    let sortedSpaces = props.spaces
    if (props.distanceShow) {
      sortedSpaces = sortedSpaces.filter(space => parseInt(space.distance) <= parseInt(props.distanceShow))
    }
    let filterSpaces = sortedSpaces.filter(space => !space.claimed);
      // && space.available || (space.available && ((space.owner !== space.claimer) && ((space.owner === props.currentUser.id) || (space.claimer === props.currentUser.id)))))
    return filterSpaces.map(space => <SpaceCard key={space.id} space={space} routerProps={props.routerProps} />)
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
