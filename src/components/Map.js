import React from 'react';
import ReactMapGL, { Marker, LinearInterpolator, FlyToInterpolator, Popup, GeolocateControl } from 'react-map-gl';
import { connect } from 'react-redux'

// import actions!
import {
  changeViewport,
  openPopup,
  closePopup,
  updateUserMarker,
  openSpace
} from '../actions'

class Map extends React.Component {

  renderNewSpaceMarker = () => {
    if (this.props.marker) {
      return (
        <Marker latitude={parseFloat(this.props.marker.latitude)} longitude={parseFloat(this.props.marker.longitude)} >
          <div onClick={() => this.props.openSpace(this.props.selectedSpace)} onMouseOut={this.props.closePopup} onMouseOver={() => this.props.openPopup([parseFloat(this.props.marker.latitude), parseFloat(this.props.marker.longitude)], this.props.marker.address)} className="mapMarkerStyle"></div>
        </Marker>
      )
    }
  }

  renderMarkers = () => {
    // let filterSpaces1 = this.props.spaces.filter(space => (parseFloat(space.longitude) < this.props.mapBounds._ne.lng) && (parseFloat(space.longitude) > this.props.mapBounds._sw.lng) && (space => parseFloat(space.latitude) < this.props.mapBounds._ne.lat && parseFloat(space.latitude) > this.props.mapBounds._sw.lat))
    let filterSpaces = this.props.spaces.filter(space => !space.claimed && space.available || (space.available && ((space.owner !== space.claimer) && ((space.owner === this.props.currentUser) || (space.claimer === this.props.currentUser)))))
    return filterSpaces.map(space => {
      let lat = parseFloat(space.latitude)
      let lng = parseFloat(space.longitude)
      if (this.props.selectedSpace && (this.props.selectedSpace.id === space.id) && this.props.selectedSpace.owner === this.props.selectedSpace.claimer) {
        return (
          <Marker key={space.id} latitude={parseFloat(this.props.selectedSpace.latitude)} longitude={parseFloat(this.props.selectedSpace.longitude)} >
            <div onClick={() => this.props.openSpace(space)} onMouseOut={this.props.closePopup} onMouseOver={() => this.props.openPopup([parseFloat(this.props.selectedSpace.latitude), parseFloat(this.props.selectedSpace.longitude)], space.address)} className="mapUserMarkerStyle"></div>
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

  render() {
    return(
      <ReactMapGL
      ref={ map => this.mapRef = map }
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      {...this.props.viewport}
      mapStyle={'mapbox://styles/mapbox/streets-v9'}
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
      }
      <GeolocateControl
      className="geolocate-user"
      positionOptions={{enableHighAccuracy: false}}
      trackUserLocation={true}
      />
      {
        this.props.createSpace
        ?
        this.renderNewSpaceMarker()
        :
        this.renderMarkers()
      }
      {this.props.showPopup ? <Popup
        latitude={this.props.popupDets.coords[0]}
        longitude={this.props.popupDets.coords[1]}
        closeButton={false}
        anchor="bottom" >
        <div>
        {this.props.popupDets.text.split(' ').slice(0, 2).join(' ').replace(/,/g, '')}
        </div>
        </Popup> : null}
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
    mapBounds: state.map.mapBounds
  }
}

// add msp to map state to props as first argument (or null), then map dispatch actions as second argument
export default connect(msp, {
  changeViewport,
  openPopup,
  closePopup,
  updateUserMarker,
  openSpace
})(Map);
