import {
  CHANGE_VIEWPORT,
  OPEN_POPUP,
  CLOSE_POPUP,
  FETCH_SPOTS,
  UPDATE_USER_MARKER,
  CLAIM_SPACE,
  NEW_SPACE,
  OPEN_SPACE,
  SHOW_SPACE,
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
  spaces: [],
  users: [],
  selectedSpace: null
}

function mapReducer(prevState=defaultState, action) {
  switch(action.type) {
    case CHANGE_VIEWPORT:
      return {...prevState, viewport: action.payload}
    case OPEN_POPUP:
      return {...prevState, showPopup: true, popupDets: {
        text: action.payload.text,
        coords: action.payload.coords
      }}
    case OPEN_SPACE:
      return {...prevState, selectedSpace: action.payload}
    case CLOSE_POPUP:
      return {...prevState, showPopup: false}
    case FETCH_SPOTS:
      return {...prevState, spaces: action.payload.spaces, users: action.payload.users}
    case UPDATE_USER_MARKER:
      return {...prevState, currentPosition: {latitude: action.payload[1], longitude: action.payload[0]}}
    case CLAIM_SPACE:
      let foundSpot = prevState.spaces.find(space => space.id === action.payload.id)
      let newSpaces = [...prevState.spaces].map(spot => { if (spot.id !== foundSpot.id) { return spot } else { return action.payload }})
      return {...prevState, spaces: newSpaces, selectedSpace: action.payload}
    case NEW_SPACE:
      return {...prevState, spaces: [...prevState.spaces, action.payload]}
    case SHOW_SPACE:
      return {...prevState, selectedSpace: action.payload}
    default:
      return {...prevState}
  }
}

export default mapReducer
