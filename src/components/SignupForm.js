import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { handleSignupSubmit, closeAlert, handleGoogleLogin } from '../actions/actions'
import { Button, Form } from 'semantic-ui-react'
import { GoogleLogin } from 'react-google-login';
import Map from './Map'

const SignupForm = (props) => {
  const [account, setAccount] = useState({
    name: '',
    username: '',
    password: ''
  })

  useEffect(() => {
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
          <Form onSubmit={(event) => props.handleSignupSubmit(event, account, props.routerProps.history)}>
            <Form.Field>
              <label>Name</label>
              <input placeholder='Name' name="name" onChange={handleChange} />
            </Form.Field>
            <Form.Field>
              <label>Username</label>
              <input placeholder='Username' name="username" onChange={handleChange} />
            </Form.Field>
            <Form.Field>
              <label>Password</label>
              <input placeholder='Password' name="password" type="password" onChange={handleChange} />
            </Form.Field>
            <Button type='submit'>Sign Up</Button>
          </Form>
          <div className="ui horizontal divider">
          Or
        </div>
        <div className="google-login-container">
          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            buttonText="Create an account with Google"
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy={'single_host_origin'}
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
    alert: state.user.alert
  }
}

export default connect(msp, {
  handleSignupSubmit,
  closeAlert,
  handleGoogleLogin
})(SignupForm);
