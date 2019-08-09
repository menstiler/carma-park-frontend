import React from 'react';
import ReactMapGL, { Marker, CanvasOverlay, Popup, GeolocateControl } from 'react-map-gl';
import { connect } from 'react-redux'

// import actions!
import {
  changeViewport,
  openPopup,
  closePopup,
  updateUserMarker,
  openSpace
} from '../actions'

function Map(props) {

  const renderMarkers = () => {
    let filterSpaces = props.spaces.filter(space => space.owner)
    return filterSpaces.map(space => {
      let lat = parseFloat(space.latitude)
      let lng = parseFloat(space.longitude)
      if (props.selectedSpace && (props.selectedSpace.id === space.id) && props.selectedSpace.owner === props.selectedSpace.claimer) {
        return (
          <Marker key={space.id} latitude={parseFloat(props.selectedSpace.latitude)} longitude={parseFloat(props.selectedSpace.longitude)} >
            <div onClick={() => props.openSpace(space)} onMouseOut={props.closePopup} onMouseOver={() => props.openPopup([parseFloat(props.selectedSpace.latitude), parseFloat(props.selectedSpace.longitude)], space.address)} className="mapUserMarkerStyle"></div>
          </Marker>
        )
      } else {
        return (
          <Marker key={space.id} latitude={lat} longitude={lng} >
            <div onClick={() => props.openSpace(space)} onMouseOut={props.closePopup} onMouseOver={() => props.openPopup([lat, lng], space.address)} className="mapMarkerStyle"></div>
          </Marker>
        )
      }
    })
  }

  return(
    <ReactMapGL
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        {...props.viewport}
        onViewportChange={(viewport) => props.changeViewport(viewport)}
      >
      {
        props.selectedSpace && props.selectedSpace.owner === props.selectedSpace.claimer
        ?
        <Marker latitude={parseFloat(props.selectedSpace.latitude)} longitude={parseFloat(props.selectedSpace.longitude)} >
          <div onMouseOut={props.closePopup} onMouseOver={() => props.openPopup([parseFloat(props.selectedSpace.latitude), parseFloat(props.selectedSpace.longitude)], "Me")} className="mapUserMarkerStyle"></div>
        </Marker>
        :
        <Marker draggable={true} onDragEnd={(event) => props.updateUserMarker(event, event.lngLat)} latitude={props.currentPosition.latitude} longitude={props.currentPosition.longitude} >
          <div onMouseOut={props.closePopup} onMouseOver={() => props.openPopup([props.currentPosition.latitude, props.currentPosition.longitude], "Me")} className="mapUserMarkerStyle"></div>
        </Marker>
      }
      <GeolocateControl
          positionOptions={{enableHighAccuracy: false}}
          trackUserLocation={true}
        />
      {renderMarkers()}
      {props.showPopup ? <Popup
      latitude={props.popupDets.coords[0]}
      longitude={props.popupDets.coords[1]}
      closeButton={false}
      anchor="bottom" >
      <div>
        {props.popupDets.text.split(' ').slice(0, 2).join(' ').replace(/,/g, '')}
      </div>
      </Popup> : null}
    </ReactMapGL>
  )
}

// list all state attributes to use as props in the component
function msp(state) {
  return {
    viewport: state.map.viewport,
    currentPosition: state.map.currentPosition,
    showPopup: state.map.showPopup,
    popupDets: state.map.popupDets,
    spaces: state.map.spaces,
    selectedSpace: state.map.selectedSpace
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
