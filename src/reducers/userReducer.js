import moment from 'moment'
import {
  UPDATE_TIMER
} from '../types'

const defaultState = {
  currentUser: 2,
  timer: moment(new Date())
}

function userReducer(prevState=defaultState, action) {
  switch(action.type) {
    case UPDATE_TIMER:
      return {...prevState, timer: moment(new Date())}
    default:
      return {...prevState}
  }
}

export default userReducer
