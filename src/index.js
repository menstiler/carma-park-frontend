import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

// import all reducers
import mapReducer from './reducers/mapReducer'
import formReducer from './reducers/formReducer'
import { Provider } from 'react-redux'



// combine all reducers, add them as key-value pairs to combineReducers
const rootReducer = combineReducers({map: mapReducer, form: formReducer})
const store = createStore(rootReducer, applyMiddleware(thunk))

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
