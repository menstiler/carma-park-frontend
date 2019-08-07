import React, { Component } from 'react';
import './App.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapContainer from './containers/MapContainer'
import { connect } from 'react-redux'
// import SearchBar from './components/SearchBar'
// import { GOOGLE_TOKEN } from './vars'
// import ReactDependentScript from 'react-dependent-script';
// import PlacesAutocomplete from 'react-places-autocomplete';
// import Autocomplete from 'react-google-autocomplete';


// import actions!
import { fetchSpots } from './actions'

class App extends Component {

  componentDidMount() {
    this.props.fetchSpots()
    .then(() => console.log(this.props.spots))
  }

  render() {
    return (
      <MapContainer />
    );
  }
}

// list all state attributes to use as props in the component
function msp(state) {
  return {
    spots: state.map.spots
  }
}

// add msp to map state to props as first argument (or null), then map dispatch actions as second argument
export default connect(msp, {
  fetchSpots
})(App);
