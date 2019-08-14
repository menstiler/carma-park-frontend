import {
  CHANGE_VIEWPORT,
  OPEN_POPUP,
  CLOSE_POPUP,
  FETCH_SPOTS,
  UPDATE_USER_MARKER,
  CLAIM_SPACE,
  HANDLE_FORM_CHANGE,
  HANDLE_SUBMIT,
  NEW_SPACE,
  OPEN_SPACE,
  SHOW_SPACE,
  CANCEL_CLAIM,
  REMOVE_SPACE,
  GO_TO,
  EDIT_SPACE,
  HANDLE_EDIT_CHANGE,
  SHOW_DISTANCE,
  SET_POSITION,
  UPDATE_TIMER
} from './types'

const API = "http://localhost:3005/"

function goToViewport(coords) {
  return {type: GO_TO, payload: coords}
}

function updateTimer() {
  return {type: UPDATE_TIMER}
}
function setCurrentPosition(coords) {
  return {type: SET_POSITION, payload: coords}
}

function updateDistanceFilter(event) {
  return {type: SHOW_DISTANCE, payload: event.target.value}
}

function changeViewport(viewport) {
  return {type: CHANGE_VIEWPORT, payload: viewport}
}

function openPopup(coords, text) {
  return function(dispatch) {
    dispatch({type: OPEN_POPUP, payload: {coords, text}})
  }
}

function openSpace(space) {
  return {type: OPEN_SPACE, payload: space}
}

function closePopup() {
  return {type: CLOSE_POPUP}
}

function updateUserMarker(coords, lngLat) {
  return {type: UPDATE_USER_MARKER, payload: lngLat}
}

function fetchSpots(currentPosition) {
  return function(dispatch){
    return fetch(API + 'spaces')
    .then(resp => resp.json())
    .then(spaces => {
      const addDistances = spaces.map(space => {
        let distance = calDistance(currentPosition.latitude, currentPosition.longitude, parseFloat(space.latitude), parseFloat(space.longitude))
        return {...space, distance: distance}
      })
      let sortedSpaces = addDistances.sort(function(a, b) { return a.distance - b.distance })
      fetch(API + 'users')
      .then(resp => resp.json())
      .then(users => {
        dispatch({type: FETCH_SPOTS, payload: {spaces: sortedSpaces, users: users}})
      })
    })
  }
}

// calculate distance from origin, this function is from: https://www.geodatasource.com/developers/javascript
function calDistance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}

function claimSpace(user_id, space_id) {
  return function(dispatch){
    return fetch(API + 'user_spaces', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        user_id: user_id,
        space_id: space_id
      })
    })
    .then(resp => resp.json())
    .then(space => {
      dispatch({type: CLAIM_SPACE, payload: space})
    })
  }
}

function handleFormChange(address, coords) {
  return {type: HANDLE_FORM_CHANGE, payload: {address, coords}}
}

function createSpace(user_id, address, location, time) {
  return function(dispatch){
    dispatch({type: HANDLE_SUBMIT})
    createNewSpace(user_id, address, location, time)
    .then(resp => {
      dispatch({type: NEW_SPACE, payload: resp})
    })
  }
}

function createNewSpace(user_id, address, location, time) {
  let space = {
    owner: user_id,
    longitude: location.lng,
    latitude: location.lat,
    address: address,
    deadline: time
  }
  return fetch(API + 'spaces', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(space)
  })
  .then(resp => resp.json())
  .then(spot => {
    return spot
  })
}

function removeSpace(space_id) {
  return function(dispatch) {
    return fetch(API + 'user_spaces/remove_space', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        space_id: space_id
      })
    })
    .then(resp => resp.json())
    .then(resp => {
      dispatch({type: REMOVE_SPACE, payload: space_id})
    })
  }
}

function addSpaceAfterParking(user_id, space_id) {
  return function(dispatch){
    return fetch(API + 'user_spaces/add_space_after_park', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        user_id: user_id,
        space_id: space_id
      })
    })
    .then(resp => resp.json())
    .then(space => {
      dispatch({type: CLAIM_SPACE, payload: space})
    })
  }
}

function showSpace(space) {
  return {type: SHOW_SPACE, payload: space}
}

function cancelClaim(user_id, space_id) {
  return function(dispatch){
    return fetch(API + 'user_spaces/cancel_claim', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        user_id: user_id,
        space_id: space_id
      })
    })
    .then(resp => resp.json())
    .then(spot => {
      dispatch({type: CLAIM_SPACE, payload: spot})
    })
  }
}

function finishedParking(user_id, space_id) {
  return function(dispatch){
    return fetch(API + 'user_spaces/parked', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        user_id: user_id,
        space_id: space_id
      })
    })
    .then(resp => resp.json())
    .then(spot => {
      dispatch({type: CLAIM_SPACE, payload: spot})
    })
  }
}

function template(argsFromComponent){
  return function(dispatch){
  }
}

export {
  changeViewport,
  openPopup,
  closePopup,
  fetchSpots,
  updateUserMarker,
  claimSpace,
  handleFormChange,
  createSpace,
  openSpace,
  showSpace,
  cancelClaim,
  finishedParking,
  addSpaceAfterParking,
  removeSpace,
  goToViewport,
  updateDistanceFilter,
  setCurrentPosition,
  updateTimer
}
