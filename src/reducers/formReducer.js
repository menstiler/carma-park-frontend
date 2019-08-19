import {
  HANDLE_FORM_CHANGE,
  HANDLE_SUBMIT,
  SHOW_DISTANCE,
  UPDATE_PROGRESS_NEXT,
  UPDATE_PROGRESS_PREV
} from '../types'

const defaultState = {
  address: null,
  coords: null,
  marker: null,
  distanceShow: null,
  progress: 0,
  step: 1,
}

function formReducer(prevState=defaultState, action) {
  switch (action.type) {
    case HANDLE_FORM_CHANGE:
      return {...prevState, address: action.payload.address, coords: action.payload.coords, marker: {address: action.payload.address, latitude: action.payload.coords.lat, longitude: action.payload.coords.lng} }
    case HANDLE_SUBMIT:
      return {...prevState, query: null, address: null, coords: null, marker: null, progress: null, step: 1}
    case SHOW_DISTANCE:
      return {...prevState, distanceShow: action.payload}
    case UPDATE_PROGRESS_NEXT:
      return {...prevState, progress: prevState.progress + 35, step: prevState.step + 1}
    case UPDATE_PROGRESS_PREV:
      return {...prevState, progress: prevState.progress - 35, step: prevState.step - 1}
    default:
      return {...prevState}
  }
}


export default formReducer
