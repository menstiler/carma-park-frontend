import React, { Component } from 'react';
import Map from '../components/Map'
import { connect } from 'react-redux'
import SpacesContainer from './SpacesContainer'
import SpaceForm from '../components/SpaceForm'
import ActiveSpace from '../components/ActiveSpace'
import {  } from '../actions'

function MapContainer(props) {

  return (
    <>
      <SpaceForm />
      <div className="action-container">
        <div className="space-container">
        {
          props.selectedSpace
          && props.selectedSpace.claimed
          && (props.selectedSpace.owner === props.currentUser || props.selectedSpace.claimer === props.currentUser)
          ?
          <ActiveSpace />
          :
          <SpacesContainer />
        }
        </div>
        <div className="map-container">
          <Map />
        </div>
      </div>
    </>
  );
}

function msp(state) {
  return {
    selectedSpace: state.map.selectedSpace,
    currentUser: state.user.currentUser
  }
}

export default connect(msp, {

})(MapContainer);
