import React, { useState, useEffect, useRef } from 'react';
import ReactMapGL, { Marker, Popup, GeolocateControl } from 'react-map-gl';
import { connect } from 'react-redux'

// import actions!
import {
  changeViewport,
  openPopup,
  closePopup,
  updateUserMarker,
  openSpace,
  filterData as filterMarkers
} from '../actions/actions'

const Map = (props) => {

  const [viewport, setViewport] = useState({
    width: 400,
    height: 400,
    latitude: 40.705740,
    longitude: -74.014000,
    zoom: 15
  })

  const mapRef = useRef(null)
  
  useEffect(() => {
    if (props.parent === "form" || props.createSpace) {
      props.closePopup()
      let { longitude, latitude } = props.currentPosition;
      setViewport({
        ...viewport,
        longitude,
        latitude
      })
    }
  }, [props.currentPosition])

  const renderNewSpaceMarker = () => {
    if (props.marker) {
      return (
        <Marker latitude={parseFloat(props.marker.latitude)} longitude={parseFloat(props.marker.longitude)} >
          <div onClick={() => props.openSpace(props.selectedSpace)} onMouseOut={props.closePopup} onMouseOver={() => props.openPopup([parseFloat(props.marker.latitude), parseFloat(props.marker.longitude)], props.marker.address)} className="mapMarkerStyle"></div>
        </Marker>
      )
    }
  }
  
  const renderMarkers = () => {
    if (props.spaceLog) {
      let space = props.spaceLog
      let lat = parseFloat(space.latitude)
      let lng = parseFloat(space.longitude)
      return (
        <Marker key={space.id} latitude={lat} longitude={lng} >
          <div className="mapMarkerStyle"></div>
        </Marker>
      )
    }
    let filteredMarkers = filterMarkers(props.spaces, props.currentUser)
    return filteredMarkers.map(space => {
      let lat = parseFloat(space.latitude)
      let lng = parseFloat(space.longitude)
      if (props.activeSpace && (props.activeSpace.id === space.id) && props.activeSpace.owner === props.activeSpace.claimer) {
        return (
          <Marker key={space.id} latitude={parseFloat(props.activeSpace.latitude)} longitude={parseFloat(props.activeSpace.longitude)} >
            <div onClick={() => props.openSpace(space)} onMouseOut={props.closePopup} onMouseOver={() => props.openPopup([parseFloat(props.activeSpace.latitude), parseFloat(props.activeSpace.longitude)], space.address)} className="mapUserMarkerStyle"></div>
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

  const renderPopup = () => {
    if (props.spaceLog) return null;
    return (
      <Popup
        latitude={props.popupDets.coords[0]}
        longitude={props.popupDets.coords[1]}
        closeButton={false}
        anchor="bottom" >
        <div>
          {props.popupDets.text}
        </div>
      </Popup>
    )
  }

  // change style of map 
  const findStyle = () => {
    if (props.parent === 'form') {
      return "light-v10"
    } else if (props.mapStyle === 'dark-v10') {
      return "dark-v10"
    } else {
      return "streets-v11"
    }
  }

  useEffect(() => {
    if (props.coords) {
      let { longitude, latitude } = props.coords;
      setViewport({
        ...viewport,
        latitude,
        longitude
      })
    }
  }, [props.coords])

  const showViewport = () => {
    if (props.spaceLog) {
      let { longitude, latitude } = props.usViewport;
      return {
        ...viewport,
        longitude,
        latitude
      }
    } else if (props.createSpace) {
      return {
        ...viewport,
      }
    } else {
      return props.viewport
    }
  }

  const onViewportChange = (viewport) => {
    if (props.SpaceLog || props.createSpace) {
      setViewport(viewport)
    } else {
      props.changeViewport(viewport)
    }
  }

  const style = findStyle()

  return(
    <ReactMapGL
      ref={mapRef}
      mapboxApiAccessToken = {
        process.env.REACT_APP_MAPBOX_TOKEN
      }
      {
        ...showViewport()
      }
      mapStyle={`mapbox://styles/mapbox/${style}`}
      onViewportChange={onViewportChange}
    >
      {
        /*
        props.selectedSpace && props.selectedSpace.owner === props.selectedSpace.claimer
        ?
        <Marker latitude={parseFloat(props.selectedSpace.latitude)} longitude={parseFloat(props.selectedSpace.longitude)} >
        <div onMouseOut={props.closePopup} onMouseOver={() => props.openPopup([parseFloat(props.selectedSpace.latitude), parseFloat(props.selectedSpace.longitude)], "Me")} className="mapMarkerStyle userMarkerStyle"></div>
        </Marker>
        :
        <Marker draggable={true} onDragEnd={(event) => props.updateUserMarker(event, event.lngLat)} latitude={props.currentPosition.latitude} longitude={props.currentPosition.longitude} >
        <div onMouseOut={props.closePopup} onMouseOver={() => props.openPopup([props.currentPosition.latitude, props.currentPosition.longitude], "Me")} className="mapMarkerStyle userMarkerStyle"></div>
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
        props.createSpace
        ?
        renderNewSpaceMarker()
        :
        renderMarkers()
      }
      {
        props.showPopup
        ?
        renderPopup()
        : 
        null
      }
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
    selectedSpace: state.map.selectedSpace,
    marker: state.form.marker,
    currentUser: state.user.currentUser,
    mapStyle: state.map.mapStyle,
    activeSpace: state.map.activeSpace,
  }
}

// add msp to map state to props as first argument (or null), then map dispatch actions as second argument
export default connect(msp, {
  changeViewport,
  openPopup,
  closePopup,
  updateUserMarker,
  openSpace,
})(Map);
