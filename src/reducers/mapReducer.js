import {
  CHANGE_VIEWPORT,
  OPEN_POPUP,
  CLOSE_POPUP,
  FETCH_SPOTS,
  UPDATE_USER_MARKER,
  CLAIM_SPACE
} from '../types'

const defaultState = {
  viewport: {
    width: 400,
    height: 400,
    latitude: 40.705740,
    longitude: -74.014000,
    zoom: 15
  },
  currentPosition: {
    latitude: 40.705341,
    longitude: -74.01500,
  },
  showPopup: false,
  popupDets: {
    text: null,
    coords: []
  },
  spaces: []
}

function mapReducer(prevState=defaultState, action) {
  switch(action.type) {
    case CHANGE_VIEWPORT:
      return {...prevState, viewport: action.payload}
    case OPEN_POPUP:
      return {...prevState, showPopup: true, popupDets: {
        text: action.payload.popUpText,
        coords: action.payload.coords
      }}
    case CLOSE_POPUP:
      return {...prevState, showPopup: false}
    case FETCH_SPOTS:
      return {...prevState, spaces: action.payload}
    case UPDATE_USER_MARKER:
      return {...prevState, currentPosition: {latitude: action.payload[1], longitude: action.payload[0]}}
    case CLAIM_SPACE:
      return {...prevState, spaces: action.payload}
    default:
      return {...prevState}
  }
}

export default mapReducer
