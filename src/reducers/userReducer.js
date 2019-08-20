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
  CLOSE_CHAT,
  ALERT,
  UPDATE_NOTIFICATIONS,
  TOGGLE_NOTIFICATIONS,
  ADD_NOTIFICATION,
  HIDE_CHAT,
  CLOSE_NOTIFICATIONS
} from '../types'

const defaultState = {
  currentUser: null,
  timer: moment(new Date()),
  chats: [],
  users: [],
  activeChat: null,
  alert: null,
  notifications: [],
  showNotifications: false
}

function userReducer(prevState=defaultState, action) {
  switch(action.type) {
    case FETCH_USERS:
      return {...prevState, users: action.payload}
    case ALERT:
      return {...prevState, alert: action.payload}
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
    case HIDE_CHAT:
      return {...prevState, activeChat: null}
    case CLOSE_CHAT:
      if (action.payload !== null) {
        const filterChats = [...prevState.chats].filter(chat => chat.space !== action.payload.space)
        return {...prevState, chats: filterChats, activeChat: null}
      } else {
        return {...prevState}
      }
    case ADD_MESSAGE:
      const message = action.payload;
      const chatrooms = [...prevState.chats];
      const chatroom = chatrooms.find(
        chatroom => chatroom.id === message.chatroom_id
      );
      chatroom.messages = [...chatroom.messages, message];
      return {...prevState, chats: chatrooms}
    case UPDATE_NOTIFICATIONS:
      return {...prevState, notifications: action.payload}
    case ADD_NOTIFICATION:
      return {...prevState, notifications: [...prevState.notifications, action.payload]}
    case CLOSE_NOTIFICATIONS:
      return {...prevState, showNotifications: false}
    case TOGGLE_NOTIFICATIONS:
      return {...prevState, showNotifications: true}
    default:
      return {...prevState}
  }
}

export default userReducer
