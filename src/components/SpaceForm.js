import React, { Component } from 'react';
import { connect } from 'react-redux'
import Search from './Search'
import Map from './Map'
import { createSpace  } from '../actions'

function SpaceForm(props) {

  const handleFormSubmit = (event) => {
    event.preventDefault()
    props.createSpace(props.currentUser, props.address, props.coords)
    props.routerProps.history.push('/')
  }

  return (
    <>
    <form onSubmit={(event) => handleFormSubmit(event)}>
      <Search createSpace={true} />
      <Map createSpace={true} />
      <input type="submit" value="Add Parking Spot" />
    </form>
    </>
  );
}

function msp(state) {
  return {
    currentUser: state.user.currentUser,
    address: state.form.address,
    coords: state.form.coords
  }
}

export default connect(msp, {
  createSpace
})(SpaceForm);
