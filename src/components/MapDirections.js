import React, { useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'

import {  } from '../actions/actions'

const MapDirections = (props) => {
  const mapRef = useRef(null)

  useEffect(() => {
    const script1 = document.createElement("script");
    const script2 = document.createElement("script");
    script1.src = "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.0.2/mapbox-gl-directions.js"
    script2.src= "https://api.tiles.mapbox.com/mapbox-gl-js/v1.2.0/mapbox-gl.js"
    script1.async = true;
    script2.async = true;
    document.body.appendChild(script1);
    document.body.appendChild(script2);
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN
    mapRef.current = new mapboxgl.Map({
      container: mapRef.current,
      style: `mapbox://styles/mapbox/${props.mapStyle}`,
      center: [props.currentPosition.longitude, props.currentPosition.latitude],
      zoom: 10
    });

    mapRef.current.on('load', () => {
      let directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken
      });
      mapRef.current.addControl(directions, 'top-left');
      directions.setOrigin(props.currentPosition.address);
      directions.setDestination(props.selectedSpace.address);
      document.querySelector('.directions-control.directions-control-inputs').style.display = "none"
    });
    return () => {
      mapRef.current.remove();
    }
  }, [props.currentPosition]) 

  useEffect(() => {
    if (document.querySelector('.directions-control.directions-control-directions') !== null) {
      document.querySelector('.directions-control.directions-control-directions').style.display = props.showDirection ? "block" : "none"
    }
  }, [props.showDirection])

  const style = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '100%'
  };

  return (
    <>
      <div style={style} ref={mapRef}></div>
    </>
  )
}

function msp(state) {
  return {
    currentPosition: state.map.currentPosition,
    viewport: state.map.viewport,
    selectedSpace: state.map.selectedSpace,
    showDirection: state.map.showDirection,
    mapStyle: state.map.mapStyle
  }
}

export default connect(msp, {
})(MapDirections);
