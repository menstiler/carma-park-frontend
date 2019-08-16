import React from 'react'
import { connect } from 'react-redux'
import {  } from '../actions'
import Map from './Map'

function Landing(props) {

  return (
    
    <Map />
  )
}

function msp(state) {
  return {

  }
}

export default connect(msp, {

})(Landing);
