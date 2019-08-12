import React, { Component } from 'react';
import './App.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import MainContainer from './containers/MainContainer'
import { connect } from 'react-redux'


import { fetchSpots } from './actions'

class App extends Component {

  componentDidMount() {
    this.props.fetchSpots(this.props.currentPosition)
  }

  render() {
    return (
      <MainContainer />
    );
  }
}

function msp(state) {
  return {
    spots: state.map.spots,
    currentPosition: state.map.currentPosition
  }
}

export default connect(msp, {
  fetchSpots
})(App);
