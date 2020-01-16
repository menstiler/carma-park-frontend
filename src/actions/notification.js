import {
  API,
  HEADERS
} from '../constants'

import {
  REMOVE_ALL_NOTIFICATIONS,
  REMOVE_NOTIFICATION,
  ADD_NOTIFICATION,
  CLOSE_ACTIVE_NOTIFICATION,
  CLOSE_NOTIFICATIONS,
  TOGGLE_NOTIFICATIONS
} from '../types'

function deleteAllNotifications(user_id) {
  return function(dispatch) {
    fetch(API + 'remove_all', {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({user_id: user_id})
    });
  }
}

function handleReceivedNotifications(response) {
  return function(dispatch) {
    if (response.delete) {
      dispatch({type: REMOVE_NOTIFICATION, payload: response.notification})
    } else if (response.delete_all) {
      dispatch({type: REMOVE_ALL_NOTIFICATIONS, payload: response})
    } else {
      dispatch({type: ADD_NOTIFICATION, payload: response })
    }
  }
}

function closeActiveNotification() {
  return {type: CLOSE_ACTIVE_NOTIFICATION}
}

function handleNotificationDismiss(notification_id) {
  return function(dispatch) {
    return fetch(API + "notifications/" + notification_id, {
      method: "DELETE"
    })
  }
}

function closeNotifications() {
  return {type: CLOSE_NOTIFICATIONS}
}

function toggleShowNotifications() {
  return {type: TOGGLE_NOTIFICATIONS}
}


export {
  deleteAllNotifications,
  handleReceivedNotifications,
  handleNotificationDismiss,
  closeActiveNotification,
  closeNotifications,
  toggleShowNotifications
}