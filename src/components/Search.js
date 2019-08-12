import React from "react";
import { connect } from 'react-redux'
import Script from 'react-load-script';
import { handleFormChange, goToViewport } from '../actions'
import MapboxAutocomplete from 'react-mapbox-autocomplete';

function Search(props) {

  const handleChange = (result, lat, lng, text) => {
    props.goToViewport([lat,lng])
    if (props.createSpace) {
      props.handleFormChange(result, {lat, lng})
    }
  }

  return (
      <MapboxAutocomplete
        style={{
          width: '200px',
          margin: '0 auto',
          maxWidth: 800,
        }}
        publicKey={process.env.REACT_APP_MAPBOX_TOKEN}
        inputClass='form-control search'
        onSuggestionSelect={handleChange}
        country='us'
        resetSearch={props.createSpace ? false : true}
      />
  );
}

function msp(state) {
  return {
  }
}

export default connect(msp, {
  handleFormChange,
  goToViewport
})(Search);
