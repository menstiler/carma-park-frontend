import {
  API,
  HEADERS
} from '../constants'

function editUser(user, userId) {
  return function(dispatch){
    return fetch(API + 'users/' + userId, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        user
      })
    })
  }
}

export { 
  editUser
}