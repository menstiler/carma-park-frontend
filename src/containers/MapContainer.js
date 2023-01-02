import React from 'react';
import Map from '../components/Map'
import { connect } from 'react-redux'
import SpacesContainer from './SpacesContainer'
import ActiveSpace from '../components/ActiveSpace'
import FilterContainer from './FilterContainer'
import { Route, Switch, Link } from 'react-router-dom'
import { changeMapStyle, closeForm } from '../actions/actions'
import { Button, Popup, Progress, Modal } from 'semantic-ui-react'
import '../styles/loader.scss';
import SpaceForm from '../components/SpaceForm'
import Loader from '../components/Loader'

const MapContainer = (props) => {
  if (props.loading) {
    return <Loader />
  } else if (props.activeSpace) {
    return <ActiveSpace {...props} />  
  } else {
    return <Spaces {...props} />
  }
}

const Spaces = (props) => {
  const style = (props.mapStyle === 'dark-v10' ? 'streets-v11' : 'dark-v10')

  return (
    <>
      <Route path="/add_space" component={routerProps => <AddSpace {...routerProps} {...props} />} />
      <div className="action-container">
        <SpacesContainer {...props}  />
        <div className="map-container">
          <FilterContainer />
          <Map />
        </div>
        <div className="icon-buttons">
          <Popup content={`Change to ${props.mapStyle === 'dark-v10' ? "Light Mode" : "Night Mode"}`} basic trigger={<Button icon={props.mapStyle === 'dark-v10' ? "lightbulb outline" : "lightbulb" } className="toggle-style"  onClick={() => props.changeMapStyle(style)} />} />
        </div>  
      </div>
    </>
  )
}

const AddSpace = (props) => {

  const closeForm = () => {
    props.closeForm()
    props.history.push('/')
  }

  return (
    <Modal 
      open={true}
      dimmer={'inverted'}
      onClose={closeForm}
      className="space-form-modal"
    >
      <Progress percent={props.progress} size='tiny'></Progress>
      <SpaceForm />
      <Modal.Actions>
        <Button onClick={closeForm}>
          Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  )
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
