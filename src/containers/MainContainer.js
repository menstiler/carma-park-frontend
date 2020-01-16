import React from 'react';
import MapContainer from './MapContainer'
import SpaceForm from '../components/SpaceForm'
import LoginForm from '../components/LoginForm'
import SignupForm from '../components/SignupForm'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import { Progress } from 'semantic-ui-react'
import '../styles/mainContainer.scss';
import Profile from '../components/Profile'

function MainContainer(props) {

  return (
    <>
      <Switch>
        <Route path="/login" render={(routerProps) => <LoginForm routerProps={routerProps}/>} />
        <Route path="/sign_up" render={(routerProps) => <SignupForm routerProps={routerProps}/>} />
        <Route path="/profile" render={(routerProps) => <Profile routerProps={routerProps}/>} />
        <Route path="/add_space" render={(routerProps) => {
          return (
            <>
              <Progress percent={props.progress} size='tiny'></Progress>
              <SpaceForm routerProps={routerProps} />
            </>
          )
        }} />
        <Route path="/" component={MapContainer} />
      </Switch>
    </>
  );
}

function msp(state) {
  return {
    currentUser: state.user.currentUser,
    loading: state.map.loading,
    progress: state.form.progress
  }
}

export default connect(msp, {

})(MainContainer);
