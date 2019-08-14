import React from 'react'
import { connect } from 'react-redux'
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'

import {  } from '../actions'

class MapDirections extends React.Component {

  componentDidMount () {
    const script1 = document.createElement("script");
    const script2 = document.createElement("script");
    script1.src = "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.0.2/mapbox-gl-directions.js"
    script2.src= "https://api.tiles.mapbox.com/mapbox-gl-js/v1.2.0/mapbox-gl.js"
    script1.async = true;
    script2.async = true;
    document.body.appendChild(script1);
    document.body.appendChild(script2);

    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.props.viewport.longitude, this.props.viewport.latitude],
      zoom: 10
    });

    this.map.on('load', () => {
      let directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken
      });
      this.map.addControl(directions, 'top-left');
      directions.setOrigin(this.props.currentPosition.address);
      directions.setDestination(this.props.selectedSpace.address);
      document.querySelector('.directions-control.directions-control-inputs').style.display = "none"
    });

  }

  componentWillUnmount() {
    this.map.remove();
  }

  componentDidUpdate() {
    document.querySelector('.directions-control.directions-control-directions').style.display = this.props.showDirection ? "block" : "none"
  }

  render() {
    const style = {
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: '100%'
    };

    return (
      <div style={style} ref={el => (this.mapContainer = el)}></div>
    )
  }
}

function msp(state) {
  return {
    currentPosition: state.map.currentPosition,
    viewport: state.map.viewport,
    selectedSpace: state.map.selectedSpace,
    showDirection: state.map.showDirection
  }
}

export default connect(msp, {
})(MapDirections);
