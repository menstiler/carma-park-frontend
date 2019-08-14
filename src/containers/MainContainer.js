import React, { Component } from 'react';
import MapContainer from './MapContainer'
import SpaceForm from '../components/SpaceForm'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import {  } from '../actions'

function MainContainer(props) {

  return (
    <Switch>
      <Route path="/add_space" render={(routerProps) => <SpaceForm routerProps={routerProps} />} />
      <Route path="/" component={MapContainer} />
    </Switch>
  );
}

function msp(state) {
  return {

  }
}

export default connect(msp, {

})(MainContainer);
