import React from "react";
import { connect } from 'react-redux'
import Script from 'react-load-script';
import { handleFormChange } from '../actions'

class Search extends React.Component {

  // Declare State
  state = {
    query: ''
  };


  handleScriptLoad = () => {
    // Initialize Google Autocomplete
    /*global google*/ // To disable any eslint 'google not defined' errors
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('autocomplete'),
      {},
    );

    // Fire Event when a suggested name is selected
    this.autocomplete.addListener('place_changed', this.handlePlaceSelect);
  }

  handleChange = (event) => {
    this.setState({
      query: event.target.value
    }, () => {
      this.props.handleFormChange(this.state.query)
    })
  }

  handlePlaceSelect = () => {

    // Extract City From Address Object
    let addressObject = this.autocomplete.getPlace();
    let address = addressObject.address_components;
    let formatted = address.map(comp => comp.long_name).join(' ')
    debugger
    // Check if address is valid
    if (address) {
      // Set State
      this.setState({
        query: formatted,
      }, () => {
        debugger
        // document.getElementById('autocomplete').value =
        this.props.handleFormChange(formatted)
      })
    }
  }

  render() {
    return (
      <div>
        <Script
          url={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_TOKEN}&libraries=places`}
          onLoad={this.handleScriptLoad}
        />
        <input id="autocomplete" placeholder="Search" onChange={this.handleChange} value={this.state.query}
          style={{
            width: '200px',
            margin: '0 auto',
            maxWidth: 800,
          }}
        />
      </div>
    );
  }
}

function msp(state) {
  return {
  }
}

export default connect(msp, {
  handleFormChange
})(Search);
