import React from 'react';
import Map from '../components/Map'
import { connect } from 'react-redux'
import SpacesContainer from './SpacesContainer'
import ActiveSpace from '../components/ActiveSpace'
import MapDirections from '../components/MapDirections'
import FilterContainer from './FilterContainer'
import { Route, Switch, Link } from 'react-router-dom'
import { changeMapStyle, closeForm } from '../actions/actions'
import { Button, Popup, Progress, Modal, Icon } from 'semantic-ui-react'
import '../styles/loader.scss';
import SpaceForm from '../components/SpaceForm'

const MapContainer = (props) => {

  const style = (props.mapStyle === 'dark-v10' ? 'streets-v11' : 'dark-v10')
  
  const closeForm = () => {
    props.closeForm()
    props.history.push('/')
  }

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
              <div className="action-container">
                <SpacesContainer routerProps={routerProps}  />
                <div className="map-container">
                  <FilterContainer />
                  <Map />
                </div>
                <div className="icon-buttons">
                  <Popup content={`Change to ${props.mapStyle === 'dark-v10' ? "Light Mode" : "Night Mode"}`} basic trigger={<Button icon={props.mapStyle === 'dark-v10' ? "lightbulb outline" : "lightbulb" } className="toggle-style"  onClick={() => props.changeMapStyle(style)} />} />
                </div>  
              </div>
              <Route path="/add_space" render={(routerProps) => {
                return (
                  <Modal 
                    open={true}
                    dimmer={'inverted'}
                    onClose={closeForm}
                    className="space-form-modal"
                  >
                    <Progress percent={props.progress} size='tiny'></Progress>
                    <SpaceForm routerProps={routerProps} />
                    <Modal.Actions>
                      <Button onClick={closeForm}>
                        Cancel
                      </Button>
                    </Modal.Actions>
                  </Modal>
                )
              }} />
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
    mapStyle: state.map.mapStyle,
    progress: state.form.progress
  }
}

export default connect(msp, {
  changeMapStyle, closeForm
})(MapContainer);
