import React, { useState } from 'react'
import { connect } from 'react-redux'
import { handleLoginSubmit, closeAlert } from '../actions'
import { Button, Form, Message } from 'semantic-ui-react'
import Map from './Map'
import '../styles/loginPage.scss';

const LoginForm = (props) => {

  const [data, setData] = useState({
    username: '',
    password: '',
  })
  const [modelOpen, setModelOpen] = useState(true);

  const handleChange = (event) => {
    setData({
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
          <Form onSubmit={(event) => props.handleLoginSubmit(event, data, props.routerProps.history)}>
            {
              modelOpen
              &&
              <Message >
                <Message.Header>Welcome to Carma Park</Message.Header>
                <i className="close icon" onClick={() => setModelOpen(false)}></i>
                <p>
                    Feel free to sign up, or login with the demo account:<br/>
                    Username: test
                    <br/>
                    Password: test
                </p>
              </Message>
            }
            <Form.Field>
              <label>Username</label>
              <input placeholder='Username' name="username" onChange={handleChange} />
            </Form.Field>
            <Form.Field>
              <label>Password</label>
              <input placeholder='Password' name="password" type="password" onChange={handleChange} />
            </Form.Field>
            <Button type='submit' className='primary'>Login</Button>
          </Form>
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
