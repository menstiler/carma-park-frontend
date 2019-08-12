import {
  HANDLE_FORM_CHANGE,
  HANDLE_SUBMIT,
  HANDLE_EDIT_CHANGE,
  SHOW_DISTANCE
} from '../types'

const defaultState = {
  address: null,
  coords: null,
  marker: null,
  distanceShow: null
}

function formReducer(prevState=defaultState, action) {
  switch (action.type) {
    case HANDLE_FORM_CHANGE:
      return {...prevState, address: action.payload.address, coords: action.payload.coords, marker: {address: action.payload.address, latitude: action.payload.coords.lat, longitude: action.payload.coords.lng} }
    case HANDLE_SUBMIT:
      return {...prevState, query: null, address: null, coords: null, marker: null}
    case SHOW_DISTANCE:
      return {...prevState, distanceShow: action.payload}
    default:
      return {...prevState}
  }
}


export default formReducer
