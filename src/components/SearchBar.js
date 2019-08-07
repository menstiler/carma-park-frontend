import React from "react";
/* global google */

import { connect } from 'react-redux'

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.autocompleteInput = React.createRef();
    this.autocomplete = null;
  }

  componentDidMount = () => {
    this.autocomplete = new google.maps.places.Autocomplete(this.autocompleteInput.current,
        {"types": ["geocode"]});

    this.autocomplete.addListener('place_changed', this.handlePlaceChanged);
  }

  handlePlaceChanged = () => {
    const place = this.autocomplete.getPlace();
    this.props.onPlaceLoaded(place);
  }

  render() {
    return (
        <input ref={this.autocompleteInput}  id="autocomplete" placeholder="Enter your address"
         type="text"></input>
    );
  }
}

function msp(state) {
  return {
    spots: state.user.spots
  }
}

export default connect(msp, {

})(SearchBar);

export {
  SearchBar
};
