import React from 'react';
import MapContainer from './MapContainer'
import LoginForm from '../components/LoginForm'
import SignupForm from '../components/SignupForm'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import '../styles/mainContainer.scss';
import Profile from '../components/Profile'

const MainContainer = (props) => {
  return (
    <Switch>
      <Route path="/login" component={routerProps => <LoginForm {...props} />} />
      <Route path="/sign_up" component={routerProps => <SignupForm {...props} />} />
      <Route path="/profile" component={Profile} />
      <Route path="/" component={routerProps => <MapContainer {...props} />} />
    </Switch>
  );
}

function msp(state) {
  return {
    currentUser: state.user.currentUser,
    loading: state.map.loading,
  }
}

export default connect(msp, {

})(MainContainer);
