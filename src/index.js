import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.scss';
import App from './App';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import mapReducer from './reducers/mapReducer'
import formReducer from './reducers/formReducer'
import userReducer from './reducers/userReducer'
import { Provider } from 'react-redux'
import { ActionCableProvider } from 'react-actioncable-provider';
import { API_WS_ROOT } from './constants'

// combine all reducers, add them as key-value pairs to combineReducers
const rootReducer = combineReducers({map: mapReducer, form: formReducer, user: userReducer})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, /* preloadedState, */ composeEnhancers(
  applyMiddleware(thunk)
));

ReactDOM.render(
  <ActionCableProvider url={API_WS_ROOT}>
    <Provider store={store}>
      <Router>
        <Route path="/" render={(routerProps) => <App routerProps={routerProps} />} />
      </Router>
    </Provider>
  </ActionCableProvider>, document.getElementById('root'));
