import React from "react";
import { connect } from 'react-redux'
import { handleFormChange, goToViewport } from '../actions'
import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from '@geoapify/react-geocoder-autocomplete'
import '@geoapify/geocoder-autocomplete/styles/minimal.css'

const Search = (props) => {

  const handleChange = async (data) => {
    props.goToViewport({latitude: data.properties.lat, longitude: data.properties.lon}, props.spaces)
    if (props.createSpace) {
      props.handleFormChange(data.address_line1, {latitude: data.properties.lat, longitude: data.properties.lon})
    }
  }

  return (
    <GeoapifyContext apiKey={process.env.REACT_APP_GEOAPIFY_API_KEY}>
      <GeoapifyGeocoderAutocomplete placeholder="Enter address here"
        placeSelect={handleChange}
        />
    </GeoapifyContext>
  )
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
