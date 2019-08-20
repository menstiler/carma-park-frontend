import React from 'react';
import Search from '../components/Search'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'

import { changeMapStyle, updateDistanceFilter } from '../actions'

function FilterContainer(props) {
  const style = (props.mapStyle === 'dark-v10' ? 'streets-v11' : 'dark-v10')
  return (
    <div className="filter-container">
      <div className="filter-column-1">
        <button className={props.distanceShow ? "ui toggle button active" : "ui toggle button"} onClick={props.updateDistanceFilter} value={props.distanceShow ? null : 10}>{props.distanceShow ? "Show All" : "Show Nearby"}</button>
        {props.distanceShow ?
          <>
            <div class="filter-field">
              <label>Show Parking Spots within: {props.distanceShow} Miles</label>
              <input type="range" name="points" min="0" max="10" onChange={props.updateDistanceFilter} />
            </div>
          </>
          :
          null
        }
      </div>
      <div className="filter-column-2">
        <Search />
      </div>
      <div className="filter-column-3">
        <Button floated='left' onClick={() => props.changeMapStyle(style)}>{props.mapStyle === 'dark-v10' ? "Light Mode" : "Night Mode"}</Button>
      </div>
    </div>
  )
}

function msp(state) {
  return {
    distanceShow: state.form.distanceShow,
    mapStyle: state.map.mapStyle
  }
}

export default connect(msp, {
  updateDistanceFilter, changeMapStyle
})(FilterContainer);
