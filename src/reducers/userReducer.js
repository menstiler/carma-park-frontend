import moment from 'moment'
import _ from 'lodash';
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
  REMOVE_ALL_NOTIFICATIONS,
  REMOVE_NOTIFICATION,
  UPDATE_USER,
  REMOVE_ALL_USER_SPACES,
  REMOVE_SPACE_LOG,
  TOGGLE_LOADING_USER,
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
  showFavorites: false,
  userSpaces: [],
  loading: false,
  claimedSpot: false
}

function userReducer(prevState=defaultState, action) {
  switch(action.type) {
    case TOGGLE_LOADING_USER:
      return {...prevState, loading: !prevState.loading}
    case FETCH_USERS:
      return {...prevState, users: action.payload}
    case UPDATE_USER:
      if (action.payload.id === prevState.currentUser.id) {
        let claimedSpot = _.find(action.payload.spaces, ['claimer', action.payload.id]) || false;
        return {...prevState, currentUser: action.payload, claimedSpot }
      }
      return {...prevState}
    case REMOVE_SPACE_LOG:
      let filteredSpaceLogs = prevState.currentUser.space_logs.filter(spaceLog => {
        return spaceLog.id !== action.payload
      })
      let updatedUser = { ...prevState.currentUser, space_logs: filteredSpaceLogs }
      return {...prevState, currentUser: updatedUser }
    case ALERT:
      return {...prevState, alert: action.payload}
    case ADD_USER:  
      if (prevState.currentUser) {
        return {...prevState, users: [...prevState.users, action.payload]}
      } else {
        return {...prevState, users: [...prevState.users, action.payload], currentUser: action.payload, notifications: [], activeNotification: null}
      }
    case ADD_FAVORITE:
      const addFavoritesToUsers = [...prevState.users].map(user => {
        if (user.id !== prevState.currentUser.id) {
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
        if (user.id !== prevState.currentUser.id) {
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
      if (action.payload) {
        return {
          ...prevState,
          currentUser: action.payload,
          activeNotification: null,
          favorites: action.payload.favorites,
          notifications: action.payload.notifications,
          userSpaces: action.payload.user_spaces
        }
      } else {
        return {
          ...prevState,
          currentUser: action.payload,
          activeNotification: null,
          favorites: [],
          notifications: []
        }
      } 
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
        return {...prevState, activeChat: null}
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
      if (action.payload.user_id === prevState.currentUser.id) {
        if (prevState.notifications) {
          return {
            ...prevState,
            notifications: [...prevState.notifications, action.payload],
            activeNotification: action.payload,
            showNotifications: false
          }
        } else {
          return {
            ...prevState,
            notifications: [action.payload],
            activeNotification: action.payload,
            showNotifications: false
          }
        }
      } else {
        return {...prevState}
      }
    case REMOVE_NOTIFICATION:
      const filteredNotifications = [...prevState.notifications].filter(notification => notification.id !== action.payload.id)
      return {...prevState, notifications: filteredNotifications}
    case REMOVE_ALL_NOTIFICATIONS:   
      if (action.payload.user === prevState.currentUser.id) {
        return {...prevState, notifications: [] }
      } else  {
        return {...prevState }
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
