import React, { Component } from 'react';
import Map from '../components/Map'
import { connect } from 'react-redux'
import SpacesContainer from './SpacesContainer'
import SpaceForm from '../components/SpaceForm'
import EditSpace from '../components/EditSpace'
import ActiveSpace from '../components/ActiveSpace'
import Search from '../components/Search'
import { Route, Switch, Link } from 'react-router-dom'
import {  } from '../actions'
import { Button } from 'semantic-ui-react'

function MapContainer(props) {

  return (
    <Switch>
      <Route path="/spaces/edit/:id" render={(routerProps) => {
        return (
          <div className="action-container">
            <div className="space-container">
              <EditSpace routerProps={routerProps} />
            </div>
            <div className="map-container">
              <Map />
            </div>
          </div>
        )}} />
      <Route path="/spaces/:id" render={() => {
        return (
          <div className="action-container">
            <div className="space-container">
              <ActiveSpace />
            </div>
            <div className="map-container">
              <Map />
            </div>
          </div>
        )}} />
      <Route path="/" render={(routerProps) => {
        return (
          <>
            <div className="action-container">
              <div className="space-container">
                <SpacesContainer routerProps={routerProps} />
              </div>
              <div className="map-container">
                <Search />
                <Map />
              </div>
              <Link to={'/add_space'} >
                <Button className="addSpace" circular icon='add' />
              </Link>
            </div>
          </>
        )}} />
    </Switch>
  );
}

function msp(state) {
  return {
    selectedSpace: state.map.selectedSpace,
    currentUser: state.user.currentUser,
    address: state.form.address
  }
}

export default connect(msp, {

})(MapContainer);
