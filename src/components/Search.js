import React from "react";
import { connect } from 'react-redux'
import { handleFormChange, goToViewport } from '../actions'
import MapboxAutocomplete from 'react-mapbox-autocomplete';
import AlgoliaPlaces from 'algolia-places-react';
import { MAPBOX_TOKEN } from '../constants';

class Search extends React.Component {

  handleChange = (result, lat, lng, text, spaces) => {
    let address;

    if (result.suburb !== undefined) {
      address = result.name + ', ' + result.suburb + ', ' + result.administrative
    } else if (result.city !== undefined) {
      address = result.name + ', ' + result.city + ', ' + result.administrative
    } else {
      address = result.name + ', ' + result.administrative
    }
    debugger;
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${result.value}.json?country=US&access_token=${MAPBOX_TOKEN}`)
    .then(resp => resp.json())
    .then(geocodeResult => {
      this.props.goToViewport({latitude: geocodeResult.features[0].center[1], longitude: geocodeResult.features[0].center[0]}, spaces)
      if (this.props.createSpace) {
        this.props.handleFormChange(address, {latitude: geocodeResult.features[0].center[1], longitude: geocodeResult.features[0].center[0]})
      }
    })
  }
  // return (
  //     <MapboxAutocomplete
  //       style={{
  //         width: '200px',
  //         margin: '0 auto',
  //         maxWidth: 800,
  //         background: 'black'
  //       }}
  //       publicKey={process.env.REACT_APP_MAPBOX_TOKEN}
  //       inputClass='form-control search'
  //       onSuggestionSelect={handleChange}
  //       country='us'
  //       resetSearch={false}
  //     />
  // );
  // }

  render() {
    const spaces = this.props.spaces
    return (
      <AlgoliaPlaces

        placeholder='Write an address here'
        options={{
          appId: process.env.REACT_APP_ALGOLIA_APP_ID,
          apiKey: process.env.REACT_APP_ALGOLIA_API_KEY,
          countries: ['us'],
          type: 'address',
          // Other options from https://community.algolia.com/places/documentation.html#options
        }}

        onChange={({suggestion}) => this.handleChange(suggestion, suggestion.latlng.lat, suggestion.latlng.lng, suggestion.value, this.props.spaces)}
      />
    );
  }
}

function msp(state) {
  return {
    spaces: state.map.spaces
  }
}

export default connect(msp, {
  handleFormChange,
  goToViewport
})(Search);
