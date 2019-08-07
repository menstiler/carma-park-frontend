import React from 'react';
import ReactMapGL, { Marker, CanvasOverlay, Popup } from 'react-map-gl';
import { connect } from 'react-redux'
import { TOKEN } from '../vars.js'

// import actions!
import { changeViewport, openPopup, closePopup, updateUserMarker} from '../actions'

function Map(props) {

  const renderMarkers = () => {
    let filterSpaces = props.spaces.filter(space => !space.claimed)
    return filterSpaces.map(space => {
      let lat = parseFloat(space.latitude)
      let lng = parseFloat(space.longitude)
      return (
        <Marker key={space.id} latitude={lat} longitude={lng} offsetLeft={-20} offsetTop={-10} >
          <div onClick={() => props.openPopup([lat, lng])} className="mapMarkerStyle"></div>
        </Marker>
      )
    })
  }

  return(
    <ReactMapGL
        mapboxApiAccessToken={TOKEN}
        {...props.viewport}
        onViewportChange={(viewport) => props.changeViewport(viewport)}
      >
      <Marker draggable={true} onDragEnd={(event) => props.updateUserMarker(event, event.lngLat)} latitude={props.currentPosition.latitude} longitude={props.currentPosition.longitude} >
        <div onClick={() => props.openPopup([props.currentPosition.latitude, props.currentPosition.longitude], "I am here!")} className="mapUserMarkerStyle"></div>
      </Marker>
      {renderMarkers()}
      {props.showPopup ? <Popup
      latitude={props.popupDets.coords[0]}
      longitude={props.popupDets.coords[1]}
      closeButton={true}
      closeOnClick={true}
      onClose={props.closePopup}
      anchor="bottom" >
      <div>{props.popupDets.text}</div>
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
    spaces: state.map.spaces
  }
}

// add msp to map state to props as first argument (or null), then map dispatch actions as second argument
export default connect(msp, {
  changeViewport,
  openPopup,
  closePopup,
  updateUserMarker
})(Map);
