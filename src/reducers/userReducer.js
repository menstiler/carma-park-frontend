import moment from 'moment'
import {
  FETCH_USERS,
  UPDATE_TIMER,
  FETCH_CHATS,
  UPDATE_CHATS,
  OPEN_CHAT,
  ADD_CHAT,
  ADD_MESSAGE,
  ADD_USER,
  SET_USER,
  CLOSE_CHAT
} from '../types'

const defaultState = {
  currentUser: null,
  timer: moment(new Date()),
  chats: [],
  users: [],
  activeChat: null,
}

function userReducer(prevState=defaultState, action) {
  switch(action.type) {
    case FETCH_USERS:
      return {...prevState, users: action.payload}
    case ADD_USER:
      return {...prevState, users: [...prevState.users, action.payload]}
    case SET_USER:
      return {...prevState, currentUser: action.payload}
    case UPDATE_TIMER:
      return {...prevState, timer: moment(new Date())}
    case UPDATE_CHATS:
      return {...prevState, chats: action.payload}
    case OPEN_CHAT:
      const foundChat = prevState.chats.find(chat => chat.space === action.payload)
      return {...prevState, activeChat: foundChat.space}
    case ADD_CHAT:
      return {...prevState, chats: [...prevState.chats, action.payload.chatroom], activeChat: action.payload.chatroom.space}
    case CLOSE_CHAT:
      const filterChats = [...prevState.chats].filter(chat => chat.space !== action.payload.space)
      return {...prevState, chats: filterChats, activeChat: null}
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
