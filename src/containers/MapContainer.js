import React from 'react';
import Map from '../components/Map'
import { connect } from 'react-redux'
import SpacesContainer from './SpacesContainer'
import ActiveSpace from '../components/ActiveSpace'
import MapDirections from '../components/MapDirections'
import FilterContainer from './FilterContainer'
import { Route, Switch, Link } from 'react-router-dom'

import { closePopup } from '../actions'
import { Button, Popup } from 'semantic-ui-react'

function MapContainer(props) {

  return (
    <Switch>
      <Route path="/spaces/:id" render={(routerProps) => {
        if (props.loading) {
          return <div>loading...</div>
        } else {
          if (props.activeSpace) {
            return (
              <div className="action-container">
                <div className="space-container">
                  <ActiveSpace routerProps={routerProps} />
                </div>
                {
                  props.activeSpace.claimer !== props.activeSpace.owner
                  ?
                  <div className="map-container directions">
                    <MapDirections />
                  </div>
                  :
                  <div className="map-container">
                    <Map />
                  </div>
                }
              </div>
            )
          } else {
            routerProps.history.push('/')
          }
        }
      }} />
      <Route path="/" render={(routerProps) => {
        return (
          <>
            <FilterContainer />
            <div className="action-container">
              <SpacesContainer routerProps={routerProps} />
              <div className="map-container">
                <Map />
              </div>
              {
                props.currentUser
                ?
                <Link to={'/add_space'} >
                <div>
                  <Popup content='Add Parking Spot' basic trigger={<Button className="addSpace" icon='car' circular onClick={props.closePopup} />} />
                </div>
                </Link>
                :
                null
              }
            </div>
          </>
        )}} />
    </Switch>
  );
}

function msp(state) {
  return {
    selectedSpace: state.map.selectedSpace,
    activeSpace: state.map.activeSpace,
    currentUser: state.user.currentUser,
    address: state.form.address,
    loading: state.map.loading
  }
}

export default connect(msp, {
  closePopup
})(MapContainer);
