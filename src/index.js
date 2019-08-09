import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { BrowserRouter as Router, Route } from 'react-router-dom'
// import all reducers
import mapReducer from './reducers/mapReducer'
import formReducer from './reducers/formReducer'
import userReducer from './reducers/userReducer'
import { Provider } from 'react-redux'
require('dotenv').config()

// combine all reducers, add them as key-value pairs to combineReducers
const rootReducer = combineReducers({map: mapReducer, form: formReducer, user: userReducer})
const store = createStore(rootReducer, applyMiddleware(thunk))

ReactDOM.render(<Provider store={store}><Router><Route path="/" render={() => <App/>} /></Router></Provider>, document.getElementById('root'));
