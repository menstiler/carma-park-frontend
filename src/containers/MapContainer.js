import React from 'react';
import Map from '../components/Map'
import { connect } from 'react-redux'
import SpacesContainer from './SpacesContainer'
import ActiveSpace from '../components/ActiveSpace'
import MapDirections from '../components/MapDirections'
import FilterContainer from './FilterContainer'
import { Route, Switch, Link } from 'react-router-dom'
import { closePopup, changeMapStyle } from '../actions/actions'
import { Button, Popup } from 'semantic-ui-react'
import '../styles/loader.scss';

function MapContainer(props) {

  const style = (props.mapStyle === 'dark-v10' ? 'streets-v11' : 'dark-v10')
  
  return (
    <Switch>
      <Route path="/spaces/:id" render={(routerProps) => {
        if (props.loading) {
          return <div className="ui active centered inline loader"></div>
        } else {
          if (props.activeSpace) {
            return (
              <div className="action-container">
                <ActiveSpace routerProps={routerProps} />
                {
                  props.activeSpace.claimer !== props.activeSpace.owner
                  ?
                  <div className="map-container-directions">
                    <MapDirections  />
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
        if (props.loading) {
          return null
        } else {
          return (
            <>
              <FilterContainer />
              <div className="action-container">
                <SpacesContainer routerProps={routerProps}  />
                <div className="map-container">
                  <Map />
                </div>
                <div className="icon-buttons">
                  {
                    props.currentUser
                    ?
                    <Link to={'/add_space'} >
                      <Popup content='Add Parking Spot' basic trigger={<Button className="add-space" icon='car' onClick={props.closePopup} />} />
                    </Link>
                    :
                    null
                  }
                  <Popup content={`Change to ${props.mapStyle === 'dark-v10' ? "Light Mode" : "Night Mode"}`} basic trigger={<Button icon={props.mapStyle === 'dark-v10' ? "lightbulb outline" : "lightbulb" } className="toggle-style"  onClick={() => props.changeMapStyle(style)} />} />
                </div>  
              </div>
            </>
          )
        }
        }} />
    </Switch>
  );
}

function msp(state) {
  return {
    selectedSpace: state.map.selectedSpace,
    activeSpace: state.map.activeSpace,
    currentUser: state.user.currentUser,
    address: state.form.address,
    loading: state.map.loading,
    mapStyle: state.map.mapStyle
  }
}

export default connect(msp, {
  closePopup, changeMapStyle
})(MapContainer);
