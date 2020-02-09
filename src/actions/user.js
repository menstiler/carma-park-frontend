import {
  API,
  HEADERS
} from '../constants'

import {
  REMOVE_USER_SPACE,
  REMOVE_ALL_USER_SPACES,
  SET_USER
} from '../types';

function editUser(user, userId) {
  return function(dispatch){
    return fetch(API + 'users/' + userId, {
      method: "PATCH",
      headers: HEADERS,
      body: JSON.stringify({
        user
      })
    })
  }
}

function deleteUserSpace(id) {
  return async function(dispatch) {
    await fetch(API + 'user_spaces/' + id, {
      method: "DELETE",
      headers: HEADERS, 
    })
    dispatch({ type: REMOVE_USER_SPACE, payload: id });
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
  return {
    type: SET_USER,
    payload: null
  }
}

export { 
  editUser,
  deleteUserSpace,
  deleteAllUserSpaces,
  deleteAccount,
  logout
}