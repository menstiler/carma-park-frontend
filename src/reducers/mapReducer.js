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
  REMOVE_SPACE,
  GO_TO,
  EDIT_SPACE,
  SET_POSITION,
  TOGGLE_SHOW_DIRECTIONS,
  TOGGLE_LOADING
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
    latitude: 40.7052529,
    longitude: -74.016259,
    address: "11 Broadway, 11 Broadway, New York, New York 10004, United States"
  },
  showPopup: false,
  popupDets: {
    text: null,
    coords: []
  },
  spaces: [],
  selectedSpace: null,
  showDirection: true,
  loading: false
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
      return {...prevState, spaces: action.payload}
    case UPDATE_USER_MARKER:
      return {...prevState, currentPosition: {latitude: action.payload[1], longitude: action.payload[0]}}
    case TOGGLE_LOADING:
      return {...prevState, loading: !prevState.loading}
    case CLAIM_SPACE:
      let foundSpot = prevState.spaces.find(space => space.id === action.payload.id)
      let newSpaces = [...prevState.spaces].map(spot => { if (spot.id !== foundSpot.id) { return spot } else { return action.payload }})
      return {...prevState, spaces: newSpaces, selectedSpace: action.payload, showPopup: false, showDirection: true, loading: false}
    case NEW_SPACE:
      return {...prevState, spaces: [...prevState.spaces, action.payload], selectedSpace: action.payload}
    case SHOW_SPACE:
      return {...prevState, selectedSpace: action.payload, showPopup: true, popupDets: {
        text: action.payload.address,
        coords: [parseFloat(action.payload.latitude), parseFloat(action.payload.longitude)]
      }}
    case REMOVE_SPACE:
      let foundSpace = prevState.spaces.find(space => space.id === action.payload.id)
      let spacesFiltered = [...prevState.spaces].filter(space => space.id !== foundSpace.id)
      return {...prevState, spaces: spacesFiltered, showPopup: false}
    case GO_TO:
      return {...prevState, viewport: {
        ...prevState.viewport,
        latitude: parseFloat(action.payload.coords.latitude),
        longitude: parseFloat(action.payload.coords.longitude)
      }}
    case SET_POSITION:
      return {...prevState, currentPosition: {...prevState.currentPosition, longitude: action.payload[0], latitude: action.payload[1]}, viewport: {...prevState.viewport, longitude: action.payload[0], latitude: action.payload[1] }}
    case TOGGLE_SHOW_DIRECTIONS:
      return {...prevState, showDirection: !prevState.showDirection}
    default:
      return {...prevState}
  }
}

export default mapReducer
