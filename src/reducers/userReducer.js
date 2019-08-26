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
  CLOSE_NOTIFICATIONS,
  CLOSE_ACTIVE_NOTIFICATION,
  SET_FAVORITES,
  ADD_FAVORITE,
  REMOVE_FAVORITE,
  REMOVE_NOTIFICATIONS,
  REMOVE_NOTIFICATION
} from '../types'

const defaultState = {
  currentUser: null,
  timer: moment(new Date()),
  chats: [],
  users: [],
  favorites: [],
  activeChat: null,
  alert: null,
  notifications: [],
  showNotifications: false,
  activeNotification: null,
  showFavorites: false
}

function userReducer(prevState=defaultState, action) {
  switch(action.type) {
    case FETCH_USERS:
      return {...prevState, users: action.payload}
    case ALERT:
      return {...prevState, alert: action.payload}
    case ADD_USER:
      if (prevState.currentUser) {
        return {...prevState, users: [...prevState.users, action.payload]}
      } else {
        return {...prevState, users: [...prevState.users, action.payload], currentUser: action.payload.id, notifications: [], activeNotification: null}
      }
    case SET_FAVORITES:
      if (prevState.currentUser) {
        const currentUser = prevState.users.find(user => user.id === prevState.currentUser)
        return {...prevState, favorites: currentUser.favorites}
      } else {
        return {...prevState}
      }
    case ADD_FAVORITE:
      const addFavoritesToUsers = [...prevState.users].map(user => {
        if (user.id !== prevState.currentUser) {
          return user
        } else {
          if (user.favorites) {
            const changeFavs = [...user.favorites, action.payload]
            return {...user, favorites: changeFavs}
          } else {
            return user
          }
        }
      })
      if (prevState.favorites) {
        return {...prevState, favorites: [...prevState.favorites, action.payload], users: addFavoritesToUsers}
      } else {
        return {...prevState, favorites: [action.payload], users: addFavoritesToUsers}
      }
    case REMOVE_FAVORITE:
      const filteredFavorites = [...prevState.favorites].filter(favorite => favorite.id !== action.payload)
      const filteredUsers = [...prevState.users].map(user => {
        if (user.id !== prevState.currentUser) {
          return user
        } else {
          if (user.favorites) {
            const changeFavs = user.favorites.filter(fav => fav.id !== action.payload)
            return {...user, favorites: changeFavs}
          } else {
            return user
          }
        }
      })
      return {...prevState, favorites: filteredFavorites, users: filteredUsers}
    case SET_USER:
      return {...prevState, currentUser: action.payload, activeNotification: null, favorites: null }
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
      debugger
      if (prevState.currentUser === action.payload.user_id) {
        return {...prevState, notifications: [...prevState.notifications, action.payload], activeNotification: action.payload, showNotifications: false }
      } else {
        return {...prevState, notifications: [...prevState.notifications, action.payload] }
      }
    case REMOVE_NOTIFICATION:
      const filteredNotifications = [...prevState.notifications].filter(notication => notication.id !== action.payload.id)
      return {...prevState, notifications: filteredNotifications}
    case REMOVE_NOTIFICATIONS:
      const removedNotifications = [...prevState.notifications].filter(notication => notication.user_id !== action.payload)
      if (prevState.currentUser === action.payload) {
        return {...prevState, notifications: removedNotifications, activeNotification: null}
      } else {
        return {...prevState, notifications: removedNotifications}
      }
    case CLOSE_NOTIFICATIONS:
      return {...prevState, showNotifications: false}
    case TOGGLE_NOTIFICATIONS:
      return {...prevState, showNotifications: true}
    case CLOSE_ACTIVE_NOTIFICATION:
      return {...prevState, activeNotification: null}
    default:
      return {...prevState}
  }
}

export default userReducer
