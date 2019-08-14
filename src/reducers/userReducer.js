import moment from 'moment'
import {
  UPDATE_TIMER,
  FETCH_CHATS,
  UPDATE_CHATS,
  OPEN_CHAT,
  ADD_CHAT,
  ADD_MESSAGE,
  ADD_USERS
} from '../types'

const defaultState = {
  currentUser: 3,
  timer: moment(new Date()),
  chats: [],
  activeChat: null,
}

function userReducer(prevState=defaultState, action) {
  switch(action.type) {
    case UPDATE_TIMER:
      return {...prevState, timer: moment(new Date())}
    case UPDATE_CHATS:
      return {...prevState, chats: action.payload}
    case OPEN_CHAT:
      return {...prevState, activeChat: action.payload}
    case ADD_CHAT:
      return {...prevState, chats: [...prevState.chats, action.payload]}
    case ADD_MESSAGE:
      const message = action.payload;
      const chatrooms = [...prevState.chats];
      const chatroom = chatrooms.find(
        chatroom => chatroom.id === message.chatroom_id
      );
      chatroom.messages = [...chatroom.messages, message];
      return {...prevState, chats: chatrooms}
    default:
      return {...prevState}
  }
}

export default userReducer
