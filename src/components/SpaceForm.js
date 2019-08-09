import React, { Component } from 'react';
import { connect } from 'react-redux'
import Search from './Search'
import { handleFormSubmit  } from '../actions'

function SpaceForm(props) {

  return (
    <form onSubmit={(event) => props.handleFormSubmit(event, 1, props.address)}>
      <Search />
      <input type="submit" />
    </form>
  );
}

function msp(state) {
  return {
    address: state.form.address
  }
}

export default connect(msp, {
  handleFormSubmit
})(SpaceForm);
