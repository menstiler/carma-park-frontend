import React from 'react';
import Search from '../components/Search'
import { connect } from 'react-redux'

import { updateDistanceFilter } from '../actions'

function FilterContainer(props) {

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
    </div>
  )
}
// <input type="number" min="0" max="10" onChange={props.updateDistanceFilter}/>

function msp(state) {
  return {
    distanceShow: state.form.distanceShow
  }
}

export default connect(msp, {
  updateDistanceFilter
})(FilterContainer);
