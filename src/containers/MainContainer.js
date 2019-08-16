import React, { Component } from 'react';
import MapContainer from './MapContainer'
import SpaceForm from '../components/SpaceForm'
import LoginForm from '../components/LoginForm'
import SignupForm from '../components/SignupForm'
import Map from '../components/Map'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import {  } from '../actions'

function MainContainer(props) {

  return (
    <>
      <Switch>
        <Route path="/login" render={(routerProps) => <LoginForm routerProps={routerProps}/>} />
        <Route path="/sign_up" render={(routerProps) => <SignupForm routerProps={routerProps}/>} />
        <Route path="/add_space" render={(routerProps) => <SpaceForm routerProps={routerProps} />} />
        <Route path="/" component={MapContainer} />
      </Switch>
    </>
  );
}

function msp(state) {
  return {
    currentUser: state.user.currentUser,
    loading: state.map.loading
  }
}

export default connect(msp, {

})(MainContainer);
