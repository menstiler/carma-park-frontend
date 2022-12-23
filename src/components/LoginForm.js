import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { handleLoginSubmit, closeAlert, handleGoogleLogin } from '../actions/actions'
import { Button, Form } from 'semantic-ui-react'
import Map from './Map'
import '../styles/loginPage.scss';

import { GoogleLogin } from 'react-google-login';

const clientId =
  '870890787841-hrvr0a3tk45hnu7bb54kdr1v4b9nh4gu.apps.googleusercontent.com';

const LoginForm = (props) => {

  const [account, setAccount] = useState({
    username: '',
    password: '',
  })
  const [token, setToken] = useState(null)

  useEffect(() => {
    const token = localStorage.token
    if (token) {
      setToken(token)
    }
    props.closeAlert()
  }, [])

  const handleChange = (event) => {
    setAccount({
      ...account,
      [event.target.name]: event.target.value
    })
  }

  const onSuccess = (res) => {
    props.handleGoogleLogin(res, props.routerProps.history)
  };

  const onFailure = (res) => {
    console.log('Login failed: res:', res);
  };

  const handleLogin = (event) => {
    props.handleLoginSubmit(event, account, props.routerProps.history)
  }

  return (
    <div className="login-page">
      <div className="form-container">
        <div className="main-title">carma park</div>
        <div className="login-form">
          {props.alert ? (
            <div className="ui error message">
              <i className="close icon" onClick={props.closeAlert}></i>
              <div className="header">{props.alert}</div>
            </div>
            )
            :
            null
          }
          <Form onSubmit={handleLogin}>
            <Form.Field>
              <label>Username</label>
              <input placeholder='Username' name="username" onChange={handleChange} />
            </Form.Field>
            <Form.Field>
              <label>Password</label>
              <input placeholder='Password' name="password" type="password" onChange={handleChange} />
            </Form.Field>
            <Button type='submit' loading={props.loading}>Login</Button>
          </Form>
          <div className="ui horizontal divider">
            Or
          </div>
          <div className="google-login-container">
            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
              buttonText="Login with Google"
              onSuccess={onSuccess}
              onFailure={onFailure}
              cookiePolicy={'single_host_origin'}
              isSignedIn={token ? true : false}
              className="google-login"
            />
          </div>
        </div>
      </div>
      <Map parent="form" />
    </div>
  )
}

function msp(state) {
  return {
    alert: state.user.alert,
    loading: state.user.loading
  }
}

export default connect(msp, {
  handleLoginSubmit,
  handleGoogleLogin,
  closeAlert
})(LoginForm);
