import React from 'react';
import './styles/index.scss';
import App from './App';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import mapReducer from './reducers/mapReducer'
import formReducer from './reducers/formReducer'
import userReducer from './reducers/userReducer'
import { Provider } from 'react-redux'
import { API_WS_ROOT } from './constants'
import { createRoot } from 'react-dom/client';
import actionCable from 'actioncable'

// combine all reducers, add them as key-value pairs to combineReducers
const rootReducer = combineReducers({map: mapReducer, form: formReducer, user: userReducer})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, /* preloadedState, */ composeEnhancers(
  applyMiddleware(thunk)
));

const container = document.getElementById('root')
const root = createRoot(container);


const CableApp = {}
CableApp.cable = actionCable.createConsumer(API_WS_ROOT)

root.render(
  <Provider store={store}>
    <Router>
      <Route path="/" component={(routerProps) => <App routerProps={routerProps} cable={CableApp.cable} />} />
    </Router>
  </Provider>
);
