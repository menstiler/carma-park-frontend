import {
  HANDLE_FORM_CHANGE,
  HANDLE_SUBMIT,
  HANDLE_EDIT_CHANGE
} from '../types'

const defaultState = {
  address: null,
  coords: null,
  marker: null
}

function formReducer(prevState=defaultState, action) {
  switch (action.type) {
    case HANDLE_FORM_CHANGE:
      return {...prevState, address: action.payload.address, coords: action.payload.coords, marker: {address: action.payload.address, latitude: action.payload.coords.lat, longitude: action.payload.coords.lng} }
    case HANDLE_SUBMIT:
      return {...prevState, query: null, address: null, coords: null}
    case HANDLE_EDIT_CHANGE:
      return {...prevState, address: action.payload}
    default:
      return {...prevState}
  }
}


export default formReducer
