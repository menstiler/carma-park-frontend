import React from 'react';
import ReactMapGL, { Marker, Popup, GeolocateControl } from 'react-map-gl';
import { connect } from 'react-redux'

// import actions!
import {
  changeViewport,
  openPopup,
  closePopup,
  updateUserMarker,
  openSpace,
  goToViewport
} from '../actions'

class Map extends React.Component {

  componentDidMount() {
    if (this.props.parent === "form" || this.props.createSpace) {
      this.props.closePopup()
      this.props.goToViewport(
        {
          latitude: this.props.currentPosition.latitude,
          longitude: this.props.currentPosition.longitude
        },
        this.props.spaces)
    }
  }

  renderNewSpaceMarker = () => {
    if (this.props.marker) {
      return (
        <Marker latitude={parseFloat(this.props.marker.latitude)} longitude={parseFloat(this.props.marker.longitude)} >
          <div onClick={() => this.props.openSpace(this.props.selectedSpace)} onMouseOut={this.props.closePopup} onMouseOver={() => this.props.openPopup([parseFloat(this.props.marker.latitude), parseFloat(this.props.marker.longitude)], this.props.marker.address)} className="mapMarkerStyle"></div>
        </Marker>
      )
    }
  }
  
  // filtering which spots to mark on map
  renderMarkers = () => {
    let filterSpaces = this.props.spaces.filter(space =>
      (!space.claimed && space.available)
      ||
      (
        (space.claimed && space.available)
        &&
        (
          (space.owner !== space.claimer)
          &&
          (space.owner === this.props.currentUser || space.claimer === this.props.currentUser)
        )
      )
      ||
      (space.claimed && ((space.owner === space.claimer) && (space.owner === this.props.currentUser)))
    )
    return filterSpaces.map(space => {
      let lat = parseFloat(space.latitude)
      let lng = parseFloat(space.longitude)
      if (this.props.activeSpace && (this.props.activeSpace.id === space.id) && this.props.activeSpace.owner === this.props.activeSpace.claimer) {
        return (
          <Marker key={space.id} latitude={parseFloat(this.props.activeSpace.latitude)} longitude={parseFloat(this.props.activeSpace.longitude)} >
            <div onClick={() => this.props.openSpace(space)} onMouseOut={this.props.closePopup} onMouseOver={() => this.props.openPopup([parseFloat(this.props.activeSpace.latitude), parseFloat(this.props.activeSpace.longitude)], space.address)} className="mapUserMarkerStyle"></div>
          </Marker>
        )
      } else {
        return (
          <Marker key={space.id} latitude={lat} longitude={lng} >
            <div onClick={() => this.props.openSpace(space)} onMouseOut={this.props.closePopup} onMouseOver={() => this.props.openPopup([lat, lng], space.address)} className="mapMarkerStyle"></div>
          </Marker>
        )
      }
    })
  }

  renderPopup = () => {
    return (
      <Popup
      latitude={this.props.popupDets.coords[0]}
      longitude={this.props.popupDets.coords[1]}
      closeButton={false}
      anchor="bottom" >
      <div>
      {this.props.popupDets.text}
      </div>
      </Popup>
    )
  }


  // change style of map 
  findStyle = () => {
    if (this.props.parent === 'form') {
      return "light-v10"
    } else if (this.props.mapStyle === 'dark-v10') {
      return "dark-v10"
    } else {
      return "streets-v11"
    }
  }

  render() {
    const style = this.findStyle()
    return(
      <ReactMapGL
      ref={ map => this.mapRef = map }
      mapboxApiAccessToken = {
        process.env.REACT_APP_MAPBOX_TOKEN
      }
      {...this.props.viewport}
      mapStyle={`mapbox://styles/mapbox/${style}`}
      onViewportChange={(viewport) => this.props.changeViewport(viewport)}
      >
      {
        /*
        this.props.selectedSpace && props.selectedSpace.owner === props.selectedSpace.claimer
        ?
        <Marker latitude={parseFloat(props.selectedSpace.latitude)} longitude={parseFloat(props.selectedSpace.longitude)} >
        <div onMouseOut={props.closePopup} onMouseOver={() => props.openPopup([parseFloat(props.selectedSpace.latitude), parseFloat(props.selectedSpace.longitude)], "Me")} className="mapUserMarkerStyle"></div>
        </Marker>
        :
        <Marker draggable={true} onDragEnd={(event) => props.updateUserMarker(event, event.lngLat)} latitude={props.currentPosition.latitude} longitude={props.currentPosition.longitude} >
        <div onMouseOut={props.closePopup} onMouseOver={() => props.openPopup([props.currentPosition.latitude, props.currentPosition.longitude], "Me")} className="mapUserMarkerStyle"></div>
        </Marker>
        */
        /*
        <GeolocateControl
        className="geolocate-user"
        positionOptions={{enableHighAccuracy: false}}
        trackUserLocation={true}
        />
        */
      }
      {
        this.props.createSpace
        ?
        this.renderNewSpaceMarker()
        :
        this.renderMarkers()
      }
      {
        this.props.showPopup ?
        this.renderPopup()
        : null
      }
      </ReactMapGL>
    )
  }
}

// list all state attributes to use as this.props in the component
function msp(state) {
  return {
    viewport: state.map.viewport,
    currentPosition: state.map.currentPosition,
    showPopup: state.map.showPopup,
    popupDets: state.map.popupDets,
    spaces: state.map.spaces,
    selectedSpace: state.map.selectedSpace,
    marker: state.form.marker,
    currentUser: state.user.currentUser,
    mapStyle: state.map.mapStyle,
    activeSpace: state.map.activeSpace
  }
}

// add msp to map state to props as first argument (or null), then map dispatch actions as second argument
export default connect(msp, {
  changeViewport,
  openPopup,
  closePopup,
  updateUserMarker,
  openSpace,
  goToViewport
})(Map);
