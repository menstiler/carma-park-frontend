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
} from './types'

import { GOOGLE_TOKEN } from './vars.js'

const API = "http://localhost:3000/"

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

function fetchSpots() {
  return function(dispatch){
    return fetch(API + 'spaces')
    .then(resp => resp.json())
    .then(spaces => {
      fetch(API + 'users')
      .then(resp => resp.json())
      .then(users => {
        dispatch({type: FETCH_SPOTS, payload: {spaces: spaces, users: users}})
      })
    })
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
    .then(spot => {
      dispatch({type: CLAIM_SPACE, payload: spot})
    })
  }
}

function handleFormChange(query) {
  return {type: HANDLE_FORM_CHANGE, payload: query}
}

function handleFormSubmit(event, user_id, location) {
  debugger
  event.preventDefault()
  return function(dispatch){
    getCoordsFromAddress(location)
    .then(resp => {
      debugger
      createNewSpace(user_id, location, resp)
      .then(resp => {
        dispatch({type: NEW_SPACE, payload: resp})
      })
    })
  }
}

function createNewSpace(user_id, address, location) {
  let space = {
    owner: user_id,
    longitude: location.lng,
    latitude: location.lat,
    address: address
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

function getCoordsFromAddress(address) {
  return fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GOOGLE_TOKEN}`)
  .then(resp => resp.json())
  .then(json => {
    return json.results[0].geometry.location
  })
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
  handleFormSubmit,
  openSpace,
  showSpace,
  cancelClaim,
  finishedParking
}
