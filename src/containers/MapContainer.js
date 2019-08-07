import React, { Component } from 'react';
import Map from '../components/Map'
import { connect } from 'react-redux'
import SpacesContainer from './SpacesContainer'
import SpaceForm from '../components/SpaceForm'

import {  } from '../actions'

function MapContainer() {

  return (
    <>
      <SpaceForm />
      <SpacesContainer />
      <Map />
    </>
  );
}

function msp(state) {
  return {

  }
}

export default connect(msp, {

})(MapContainer);
