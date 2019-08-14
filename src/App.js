import React, { Component } from 'react';
import './App.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import MainContainer from './containers/MainContainer'
import { connect } from 'react-redux'
import { fetchSpots, setCurrentPosition, updateTimer } from './actions'

let mainInterval

class App extends Component {

  componentDidMount() {
    this.props.fetchSpots(this.props.currentPosition)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.displayLocationInfo);
    } else {
      this.props.setCurrentPosition([-74.01500, 40.705341])
    }
    mainInterval = setInterval(() => {
      this.props.updateTimer()
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(mainInterval)
  }

  displayLocationInfo = (position) => {
    const lng = position.coords.longitude;
    const lat = position.coords.latitude;
    this.props.setCurrentPosition([lng, lat])
  }

  render() {
    // console.log(this.props.timer)
    return (
      <MainContainer />
    );
  }
}

function msp(state) {
  return {
    spots: state.map.spots,
    currentPosition: state.map.currentPosition,
    timer: state.user.timer
  }
}

export default connect(msp, {
  fetchSpots,
  setCurrentPosition,
  updateTimer
})(App);
