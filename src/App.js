import React, { Component } from 'react';
import './App.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapContainer from './containers/MapContainer'
import { connect } from 'react-redux'


import { fetchSpots } from './actions'

class App extends Component {

  componentDidMount() {
    this.props.fetchSpots()
  }

  render() {
    return (
      <MapContainer />
    );
  }
}

function msp(state) {
  return {
    spots: state.map.spots
  }
}

export default connect(msp, {
  fetchSpots
})(App);
