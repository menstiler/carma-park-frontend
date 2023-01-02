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
  MAP_STYLE,
  UPDATE_SPACE,
  CANCEL_CLAIM,
  CREATE_AFTER_PARK,
  PARKED
} from '../types'

const defaultState = {
  viewport: {
    width: 400,
    height: 400,
    latitude: null,
    longitude: null,
    zoom: 15
  },
  currentPosition: {
    latitude: null,
    longitude: null,
    address: null
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

const updatedSpaces = (payload, spaces) => {
  const space = spaces.find(space => space.id === payload.id)
  return [...spaces].map(spot => { if (spot.id !== space.id) { return spot } else { return payload }})
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
      let newSpaces = updatedSpaces(action.payload, prevState.spaces)
      if (prevState.selectedSpace && (prevState.selectedSpace.id === action.payload.id)) {
        return {...prevState, spaces: newSpaces, selectedSpace: action.payload, activeSpace: action.payload, showPopup: false, showDirection: true, loading: false}
      } else {
        return {...prevState, spaces: newSpaces}
      }
    case CANCEL_CLAIM:
      let newSpacesAfterCancel = updatedSpaces(action.payload, prevState.spaces)
      return {...prevState, spaces: newSpacesAfterCancel, activeSpace: null, selectedSpace: null, showPopup: false, showDirection: null, loading: false}
    case PARKED:
      let newSpacesAfterParked = updatedSpaces(action.payload, prevState.spaces)
      if (prevState.selectedSpace && (prevState.selectedSpace.id === action.payload.id)) {
        return {...prevState, spaces: newSpacesAfterParked, activeSpace: action.payload, selectedSpace: action.payload, showPopup: false, showDirection: null, loading: false}
      } else {
        return {...prevState, spaces: newSpacesAfterParked}
      }
    case CREATE_AFTER_PARK:
      let newSpacesAfterCreating = updatedSpaces(action.payload, prevState.spaces)
      return {...prevState, spaces: newSpacesAfterCreating, activeSpace: null, selectedSpace: null, showPopup: false, showDirection: null, loading: false}
    case UPDATE_ACTIVE_SPACE:
      return {...prevState, activeSpace: action.payload, selectedSpace: action.payload}
    case NEW_SPACE:
      return {...prevState, spaces: [...prevState.spaces, action.payload], loading: false}
    case REMOVE_SPACE:
      let foundSpace = prevState.spaces.find(space => space.id === action.payload.id)
      let spacesFiltered = [...prevState.spaces].filter(space => space.id !== foundSpace.id)
      return {...prevState, spaces: spacesFiltered, showPopup: false, selectedSpace: null}
    case SHOW_SPACE:
      if (prevState.selectedSpace && action.payload === prevState.selectedSpace) {
        return {...prevState, selectedSpace: null}
      } else {
        return {...prevState, selectedSpace: action.payload, showPopup: true, popupDets: {
          text: action.payload.address,
          coords: [parseFloat(action.payload.latitude), parseFloat(action.payload.longitude)]
        }}
      }
    case GO_TO:
      return {...prevState, viewport: {
        ...prevState.viewport,
        latitude: parseFloat(action.payload.coords.latitude),
        longitude: parseFloat(action.payload.coords.longitude)
      }}
    case SET_POSITION:
      return {...prevState, currentPosition: {...prevState.currentPosition, longitude: action.payload[0], latitude: action.payload[1], address: action.payload[2]}, viewport: {...prevState.viewport, longitude: action.payload[0], latitude: action.payload[1] }}
    case TOGGLE_SHOW_DIRECTIONS:
      return {...prevState, showDirection: !prevState.showDirection}
    case MAP_STYLE:
      return {...prevState, mapStyle: action.payload}
    default:
      return {...prevState}
  }
}

export default mapReducer
