import {

} from '../types'

const defaultState = {
  currentUser: 2
}

function userReducer(prevState=defaultState, action) {
  switch(action.type) {
    default:
      return {...prevState}
  }
}

export default userReducer
