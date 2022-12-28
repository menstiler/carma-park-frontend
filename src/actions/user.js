import {
  API,
  HEADERS
} from '../constants'

import {
  REMOVE_ALL_USER_SPACES,
  SET_USER,
  REMOVE_SPACE_LOG,
  UPDATE_USER,
  UPDATE_ACTIVE_SPACE,
  CLOSE_CHAT
} from '../types';

function getUserSpaces(userId) {
  fetch(API + 'users/' + userId + '/user_spaces')
  .then(resp => resp.json())
  .then(users => {
  })
}


function editUser(user, userId) {
  return function(dispatch){
    return fetch(API + 'users/' + userId, {
      method: "PATCH",
      headers: HEADERS,
      body: JSON.stringify({
        user,
      })
    })
  }
}

function deleteSpaceLog(id) {
  return async function(dispatch) {
    await fetch(API + 'space_logs/' + id, {
      method: "DELETE",
      headers: HEADERS, 
    })
    dispatch({ type: REMOVE_SPACE_LOG, payload: id });
  }
}

function deleteAllUserSpaces(id) {
  return async function(dispatch) {
    await fetch(API + 'user_spaces', {
      method: "PATCH",
      headers: HEADERS,
      body: JSON.stringify({id})
    })
    dispatch({ type: REMOVE_ALL_USER_SPACES })
  }
}

function deleteAccount(id, history) {
  return async function(dispatch) {
    await fetch(API + 'users/' + id, {
      method: "DELETE"
    })
    dispatch({
      type: SET_USER,
      payload: null
    })
    history.push("/login")
    localStorage.removeItem("token")
  }
}

function logout(history) {
  history.push("/login")
  localStorage.removeItem("token")
  return function(dispatch) {
    dispatch({
      type: SET_USER,
      payload: null
    })
    dispatch({
      type: UPDATE_ACTIVE_SPACE,
      payload: null
    })
    dispatch({
      type: CLOSE_CHAT,
      payload: null
    })
  }
}

export { 
  editUser,
  deleteSpaceLog,
  deleteAllUserSpaces,
  deleteAccount,
  logout,
  getUserSpaces
}