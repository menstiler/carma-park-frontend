import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { handleSignupSubmit, closeAlert, handleGoogleLogin } from '../actions/actions'
import { Button, Form } from 'semantic-ui-react'
import { GoogleLogin } from 'react-google-login';
import Map from './Map'

const SignupForm = (props) => {
  const [data, setData] = useState({
    name: '',
    username: '',
    password: ''
  })

  useEffect(() => {
    props.closeAlert()
  })

  const handleChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value
    })
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
          <Form onSubmit={(event) => props.handleSignupSubmit(event, data, props.routerProps.history)}>
            <Form.Field>
              <label>Name</label>
              <input placeholder='Name' name="name" value={data.name} onChange={handleChange} />
            </Form.Field>
            <Form.Field>
              <label>Username</label>
              <input placeholder='Username' name="username" value={data.username}  onChange={handleChange} />
            </Form.Field>
            <Form.Field>
              <label>Password</label>
              <input placeholder='Password' name="password" type="password" value={data.password}  onChange={handleChange} />
            </Form.Field>
            <Button type='submit' className='primary'>Sign Up</Button>
          </Form>
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
