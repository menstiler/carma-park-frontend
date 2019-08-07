import {
  HANDLE_FORM_CHANGE
} from '../types'

const defaultState = {
  address: null
}

function formReducer(prevState=defaultState, action) {
  switch (action.type) {
    case HANDLE_FORM_CHANGE:
      return {...prevState, address: action.payload}
    default:
      return {...prevState}
  }
}


export default formReducer
