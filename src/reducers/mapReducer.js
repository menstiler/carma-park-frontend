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
  SET_POSITION,
  TOGGLE_SHOW_DIRECTIONS,
  TOGGLE_LOADING,
  UPDATE_ACTIVE_SPACE,
  MAP_STYLE
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
  activeSpace: null,
  showDirection: true,
  loading: false,
  mapStyle: 'streets-v11',
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
      if (prevState.selectedSpace && ((action.payload.owner === action.payload.claimer) && (action.payload.owner !== (prevState.selectedSpace.owner || prevState.selectedSpace.claimer)))) {
        return {...prevState, spaces: newSpaces, activeSpace: action.payload, selectedSpace: null, showPopup: false, loading: false}
      } else if (prevState.selectedSpace && (prevState.selectedSpace.id === foundSpot.id)) {
        return {...prevState, spaces: newSpaces, selectedSpace: action.payload, activeSpace: action.payload, showPopup: false, showDirection: true, loading: false}
      } else {
        return {...prevState, spaces: newSpaces, activeSpace: action.payload, showPopup: false, showDirection: true, loading: false}
      }
    case UPDATE_ACTIVE_SPACE:
      return {...prevState, activeSpace: action.payload}
    case NEW_SPACE:
      return {...prevState, spaces: [...prevState.spaces, action.payload], selectedSpace: action.payload, loading: false}
    case SHOW_SPACE:
      if (prevState.selectedSpace && action.payload === prevState.selectedSpace) {
        return {...prevState, selectedSpace: null}
      } else {
        return {...prevState, selectedSpace: action.payload, showPopup: true, popupDets: {
          text: action.payload.address,
          coords: [parseFloat(action.payload.latitude), parseFloat(action.payload.longitude)]
        }}
      }
    case REMOVE_SPACE:
      let foundSpace = prevState.spaces.find(space => space.id === action.payload.id)
      let spacesFiltered = [...prevState.spaces].filter(space => space.id !== foundSpace.id)
      return {...prevState, spaces: spacesFiltered, showPopup: false, selectedSpace: null}
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
    case MAP_STYLE:
      return {...prevState, mapStyle: action.payload}
    default:
      return {...prevState}
  }
}

export default mapReducer
