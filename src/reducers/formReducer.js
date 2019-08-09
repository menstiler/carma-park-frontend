import {
  HANDLE_FORM_CHANGE,
  HANDLE_SUBMIT
} from '../types'

const defaultState = {
  address: ''
}

function formReducer(prevState=defaultState, action) {
  switch (action.type) {
    case HANDLE_FORM_CHANGE:
    console.log(action.payload);
      return {...prevState, address: action.payload }
    case HANDLE_SUBMIT:
      return {...prevState, query: null, address: null}
    default:
      return {...prevState}
  }
}


export default formReducer
