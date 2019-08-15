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
  REMOVE_SPACE,
  GO_TO,
  EDIT_SPACE,
  HANDLE_EDIT_CHANGE,
  SHOW_DISTANCE,
  SET_POSITION,
  UPDATE_TIMER,
  TOGGLE_SHOW_DIRECTIONS,
  UPDATE_CHATS,
  OPEN_CHAT,
  ADD_CHAT,
  ADD_MESSAGE,
  ADD_USERS,
  SET_USER,
  CLOSE_CHAT,
  TOGGLE_LOADING
} from './types'

const API = "http://localhost:3005/"

const HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

function handleAutoLogin(token) {
  return function(dispatch) {
    return fetch(API + "auto_login", {
      headers: {
        "Authorization": token
      }
    })
    .then(res => res.json())
    .then(response => {
      if (response.errors){
        alert(response.errors)
      } else {
        dispatch({type: SET_USER, payload: response})
      }
    })
  }
}

function handleLoginSubmit(event, user) {
  event.preventDefault()
  return function(dispatch) {
    fetch(API + "login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(user)
    })
    .then(res => res.json())
    .then(response => {
      if (response.errors){
        alert(response.errors)
      } else {
        dispatch({type: SET_USER, payload: response})
      }
    })
  }
}

function goToViewport(coords) {
  return {type: GO_TO, payload: coords}
}

function fetchChats() {
  return function(dispatch) {
    return fetch(`${API}chatrooms`)
    .then(res => res.json())
    .then(chatrooms => {
      dispatch({type: UPDATE_CHATS, payload: chatrooms})
    });
  }
}

function handleReceivedSpace(response, history, currentUser) {
  const space = response.space;
  if (response.update) {
    if (currentUser === space.claimer) {
      history.push(`/spaces/${space.id}`)
    }
    return {type: CLAIM_SPACE, payload: space}
  } else if (response.delete) {
    return {type: REMOVE_SPACE, payload: space}
  } else {
    return {type: NEW_SPACE, payload: space}
  }
}

function handleReceivedChatroom(response) {
  const { chatroom } = response;
  return {type: ADD_CHAT, payload: chatroom}
};

function handleReceivedMessage(response) {
  const { message } = response;
  return {type: ADD_MESSAGE, payload: message }
};

function openChat(space_id) {
  return {type: OPEN_CHAT, payload: space_id}
}

function openNewChat(space_id) {
  return function(dispatch) {
    const chatroom = { space: space_id }
    return fetch(API + "chatrooms", {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify(chatroom)
    })
  }
}

function updateTimer() {
  return {type: UPDATE_TIMER}
}

function toggleShowDirections() {
  return {type: TOGGLE_SHOW_DIRECTIONS}
}
function setCurrentPosition(coords) {
  return {type: SET_POSITION, payload: coords}
}

function updateDistanceFilter(event) {
  return {type: SHOW_DISTANCE, payload: event.target.value}
}

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

function fetchSpots(currentPosition) {
  return function(dispatch){
    return fetch(API + 'spaces')
    .then(resp => resp.json())
    .then(spaces => {
      const addDistances = spaces.map(space => {
        let distance = calDistance(currentPosition.latitude, currentPosition.longitude, parseFloat(space.latitude), parseFloat(space.longitude))
        return {...space, distance: distance}
      })
      let sortedSpaces = addDistances.sort(function(a, b) { return a.distance - b.distance })
      fetch(API + 'users')
      .then(resp => resp.json())
      .then(users => {
        dispatch({type: FETCH_SPOTS, payload: {spaces: sortedSpaces, users: users}})
      })
    })
  }
}

// calculate distance from origin, this function is from: https://www.geodatasource.com/developers/javascript
function calDistance(lat1, lon1, lat2, lon2, unit) {
  if ((lat1 == lat2) && (lon1 == lon2)) {
    return 0;
  }
  else {
    var radlat1 = Math.PI * lat1/180;
    var radlat2 = Math.PI * lat2/180;
    var theta = lon1-lon2;
    var radtheta = Math.PI * theta/180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    return dist;
  }
}

function claimSpace(user_id, space_id) {
  return function(dispatch){
    dispatch({type: "TOGGLE_LOADING"})
    return fetch(API + 'claim', {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({
        user_id: user_id,
        space_id: space_id
      })
    })
  }
}

function handleFormChange(address, coords) {
  return {type: HANDLE_FORM_CHANGE, payload: {address, coords}}
}

function createSpace(user_id, address, location, time) {
  return function(dispatch){
    dispatch({type: HANDLE_SUBMIT})
    createNewSpace(user_id, address, location, time)
    .then(resp => {
      dispatch({type: NEW_SPACE, payload: resp})
    })
  }
}

function createNewSpace(user_id, address, location, time) {
  let space = {
    owner: user_id,
    longitude: location.lng,
    latitude: location.lat,
    address: address,
    deadline: time
  }
  return fetch(API + 'spaces', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(space)
  })
}

function removeSpace(space_id) {
  return function(dispatch) {
    return fetch(API + 'remove_space', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        space_id: space_id
      })
    })
  }
}

function addSpaceAfterParking(user_id, space_id) {
  return function(dispatch){
    return fetch(API + 'add_space_after_park', {
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
  }
}

function showSpace(space) {
  return function(dispatch) {
    dispatch({type: SHOW_SPACE, payload: space})
    dispatch({type: GO_TO, payload: [space.latitude, space.longitude]})
  }
}

function cancelClaim(user_id, space_id) {
  return function(dispatch){
    return fetch(API + 'cancel_claim', {
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
  }
}

function finishedParking(user_id, space_id) {
  return function(dispatch){
    return fetch(API + 'parked', {
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
  createSpace,
  openSpace,
  showSpace,
  cancelClaim,
  finishedParking,
  addSpaceAfterParking,
  removeSpace,
  goToViewport,
  updateDistanceFilter,
  setCurrentPosition,
  updateTimer,
  toggleShowDirections,
  fetchChats,
  openNewChat,
  openChat,
  handleReceivedMessage,
  handleReceivedChatroom,
  handleLoginSubmit,
  handleAutoLogin,
  handleReceivedSpace
}
