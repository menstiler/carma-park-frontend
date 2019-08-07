import React, { Component } from 'react';
import { connect } from 'react-redux'

import { handleFormChange  } from '../actions'

function MapContainer(props) {

  return (
    <form onSubmit={props.handleSubmit}>
      <input type="text" value={props.address} onChange={props.handleFormChange} />
    </form>
  );
}

function msp(state) {
  return {
    address: state.form.address
  }
}

export default connect(msp, {
  handleFormChange
})(MapContainer);
