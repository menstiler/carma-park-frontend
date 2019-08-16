import React, { Component } from 'react';
import Search from '../components/Search'
import { connect } from 'react-redux'


import { updateDistanceFilter } from '../actions'

function FilterContainer(props) {

  return (
    <>
      <Search />
      Show Spot within: <input type="range" name="points" min="0" max="10" onChange={props.updateDistanceFilter} />
      <p>{props.distanceShow} Miles</p>
    </>
  )
}
// <input type="number" min="0" max="10" onChange={props.updateDistanceFilter}/>

function msp(state) {
  return {
    distanceShow: state.form.distanceShow
  }
}

export default connect(msp, {
  updateDistanceFilter
})(FilterContainer);
