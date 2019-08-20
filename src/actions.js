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
  REMOVE_SPACE,
  GO_TO,
  SHOW_DISTANCE,
  SET_POSITION,
  UPDATE_TIMER,
  TOGGLE_SHOW_DIRECTIONS,
  UPDATE_CHATS,
  OPEN_CHAT,
  ADD_CHAT,
  ADD_MESSAGE,
  SET_USER,
  CLOSE_CHAT,
  TOGGLE_LOADING,
  FETCH_USERS,
  ADD_USER,
  ALERT,
  UPDATE_PROGRESS_PREV,
  UPDATE_PROGRESS_NEXT,
  UPDATE_NOTIFICATIONS,
  TOGGLE_NOTIFICATIONS,
  ADD_NOTIFICATION,
  UPDATE_ACTIVE_SPACE,
  HIDE_CHAT,
  MAP_STYLE,
  CLOSE_NOTIFICATIONS
} from './types'

const API = "http://localhost:3005/"

const HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

function changeMapStyle(style) {
  return {type: MAP_STYLE, payload: style}
}

function dispatchActiveSpace(space) {
  return {type: UPDATE_ACTIVE_SPACE, payload: space}
}

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
        dispatch({type: ALERT, payload: response.errors})
      } else {
        dispatch({type: SET_USER, payload: response.id})
      }
    })
  }
}

function hideChat() {
  return {type: HIDE_CHAT}
}

function logout(history) {
  history.push("/login")
  localStorage.removeItem("token")
  return {type: SET_USER, payload: null}
}

function closeAlert() {
  return {type: ALERT, payload: null}
}

function handleSignupSubmit(event, user, history) {
  event.preventDefault()
  return function(dispatch) {
    fetch(API + "users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({user: user})
    })
    .then(res => res.json())
    .then(response => {
      if (response.errors){
        dispatch({type: ALERT, payload: response.errors.join(', ')})
      } else {
        dispatch({type: ADD_USER, payload: response.user})
        dispatch({type: SET_USER, payload: response.user.id})
        dispatch({type: ALERT, payload: null})
        localStorage.token = response.token
        history.push('/')
      }
    })
  }
}

function handleLoginSubmit(event, user, history) {
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
        dispatch({type: ALERT, payload: response.errors})
      } else {
        dispatch({type: SET_USER, payload: response.user.id})
        dispatch({type: ALERT, payload: null})
        localStorage.token = response.token
        history.push('/')
      }
    })
  }
}

function goToViewport(coords, spaces) {
  return function(dispatch) {
    const sortedSpaces = sortSpotByDistance(coords, spaces)
    dispatch({type: FETCH_SPOTS, payload: sortedSpaces })
    dispatch({type: GO_TO, payload: {coords: coords}})
  }
}

function fetchChats() {
  return function(dispatch) {
    dispatch({type: TOGGLE_LOADING})
    return fetch(`${API}chatrooms`)
    .then(res => res.json())
    .then(chatrooms => {
      dispatch({type: UPDATE_CHATS, payload: chatrooms})
    });
  }
}

function handleReceivedNotifications(response) {
  const notification = response;
  return {type: ADD_NOTIFICATION, payload: notification}
}

function handleReceivedSpace(response, router, currentUser) {
  const space = response.space;
  if (response.action === 'update') {
    if (currentUser === space.claimer) {
      router.history.push(`/spaces/${space.id}`)
    }
    return {type: CLAIM_SPACE, payload: space}
  } else if (response.action === 'delete') {
    return {type: REMOVE_SPACE, payload: space}
  } else if (response.action === 'create') {
    return {type: NEW_SPACE, payload: space}
  }
}

function handleReceivedChatroom(response) {
  const chatroom = response.chatroom;
  if (response.action === 'create') {
    return {type: ADD_CHAT, payload: chatroom}
  } else if (response.action === 'delete') {
    return {type: CLOSE_CHAT, payload: chatroom}
  }
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

function handleNotificationDismiss(notification_id) {
  return function(dispatch) {
    return fetch(API + "notifications/" + notification_id, {
      method: "DELETE"
    })
  }
}

function fetchNotifications(user_id) {
  return function(dispatch) {
    return fetch(API + "users/" + user_id)
    .then(resp => resp.json())
    .then(user => {
      let notifications = user.notifications
      dispatch({type: UPDATE_NOTIFICATIONS, payload: notifications})
    })
  }
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

function fetchSpots(viewport) {
  return function(dispatch){
    return fetch(API + 'spaces')
    .then(resp => resp.json())
    .then(spaces => {
      const sortedSpaces = sortSpotByDistance(viewport, spaces)
      dispatch({type: FETCH_SPOTS, payload: sortedSpaces })
    })
  }
}

function sortSpotByDistance(origin, spaces) {
  const addDistances = spaces.map(space => {
    if (space.distance) {
      let newDistance = calDistance(origin.latitude, origin.longitude, parseFloat(space.latitude), parseFloat(space.longitude))
      return {...space, distance: newDistance}
    } else {
      let distance = calDistance(origin.latitude, origin.longitude, parseFloat(space.latitude), parseFloat(space.longitude))
      return {...space, distance: distance}
    }
  })
  let sortedSpaces = addDistances.sort(function(a, b) { return a.distance - b.distance })
  return sortedSpaces
}

function fetchUsers() {
  return function(dispatch) {
    return fetch(API + 'users')
    .then(resp => resp.json())
    .then(users => {
      dispatch({type: FETCH_USERS, payload: users})
      dispatch({type: TOGGLE_LOADING})
    })
  }
}


// calculate distance from origin, this function is from: https://www.geodatasource.com/developers/javascript
function calDistance(lat1, lon1, lat2, lon2, unit) {
  if ((lat1 === lat2) && (lon1 === lon2)) {
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
    if (unit==="K") { dist = dist * 1.609344 }
    if (unit==="N") { dist = dist * 0.8684 }
    return dist;
  }
}

function closeNotifications() {
  return {type: CLOSE_NOTIFICATIONS}
}

function toggleShowNotifications() {
  return {type: TOGGLE_NOTIFICATIONS}
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

function createSpace(user_id, address, location, time, image) {
  return function(dispatch){
    dispatch({type: TOGGLE_LOADING})
    dispatch({type: HANDLE_SUBMIT})
    createNewSpace(user_id, address, location, time, image)
  }
}

function nextStep() {
  return {type: UPDATE_PROGRESS_NEXT}
}

function prevStep() {
  return {type: UPDATE_PROGRESS_PREV}
}

function createNewSpace(user_id, address, location, time, image) {
  let space = {
    owner: user_id,
    longitude: location.lng,
    latitude: location.lat,
    address: address,
    deadline: time,
    image: image
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
    dispatch({type: GO_TO, payload: {coords: {latitude: space.latitude, longitude: space.longitude}}})
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
  handleReceivedSpace,
  fetchUsers,
  logout,
  handleSignupSubmit,
  closeAlert,
  nextStep,
  prevStep,
  fetchNotifications,
  handleNotificationDismiss,
  toggleShowNotifications,
  handleReceivedNotifications,
  dispatchActiveSpace,
  hideChat,
  changeMapStyle,
  closeNotifications
}
