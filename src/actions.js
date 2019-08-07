import {
  CHANGE_VIEWPORT,
  OPEN_POPUP,
  CLOSE_POPUP,
  FETCH_SPOTS,
  UPDATE_USER_MARKER,
  CLAIM_SPACE,
  HANDLE_FORM_CHANGE
} from './types'

import { GOOGLE_TOKEN } from './vars.js'

const API = "http://localhost:3000/"

function changeViewport(viewport) {
  return {type: CHANGE_VIEWPORT, payload: viewport}
}

function openPopup(coords, text) {
  return function(dispatch) {
  //   fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords[0]},${coords[1]}&key=${GOOGLE_TOKEN}`)
  //     .then(resp => resp.json())
  //     .then(json => {
  //       // let popUpText = text ? text : json.results[0].formatted_address.split(' ').slice(0, 2).join(' ').replace(",", "")
  //       let popUpText = json.results[0].formatted_address.split(' ').slice(0, 2).join(' ').replace(",", "")
  //       dispatch({type: OPEN_POPUP, payload: {coords, popUpText}})
  //     })
  }
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
    .then(spots => {
      dispatch({type: FETCH_SPOTS, payload: spots})
    })
  }
}

function claimSpace(user_id, space_id) {
  debugger
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
    .then(spots => {
      dispatch({type: CLAIM_SPACE, payload: spots})
    })
  }
}

function handleFormChange(event) {
  return {type: HANDLE_FORM_CHANGE, payload: event.target.value}
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
  handleFormChange
}
