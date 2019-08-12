import React, { Component } from 'react';
import Search from '../components/Search'
import { connect } from 'react-redux'


import { updateDistanceFilter } from '../actions'

function FilterContainer(props) {

  return (
    <>
    <Search />
    <input type="number" min="0" max="10" onChange={props.updateDistanceFilter}/>
    </>
  )
}

function msp(state) {
  return {
    distanceShow: state.form.distanceShow
  }
}

export default connect(msp, {
  updateDistanceFilter
})(FilterContainer);
