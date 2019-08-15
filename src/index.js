import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import mapReducer from './reducers/mapReducer'
import formReducer from './reducers/formReducer'
import userReducer from './reducers/userReducer'
import { Provider } from 'react-redux'
import { ActionCableProvider } from 'react-actioncable-provider';
import { API_WS_ROOT } from './constants'

require('dotenv').config()

// combine all reducers, add them as key-value pairs to combineReducers
const rootReducer = combineReducers({map: mapReducer, form: formReducer, user: userReducer})
const store = createStore(rootReducer, applyMiddleware(thunk))

ReactDOM.render(
  <ActionCableProvider url={API_WS_ROOT}>
    <Provider store={store}>
      <Router>
        <Route path="/" component={App} />
      </Router>
    </Provider>
  </ActionCableProvider>, document.getElementById('root'));
