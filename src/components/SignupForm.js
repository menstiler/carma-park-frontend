import React from 'react'
import { connect } from 'react-redux'
import { handleSignupSubmit, closeAlert } from '../actions'
import { Button, Form } from 'semantic-ui-react'

import Map from './Map'

class SignupForm extends React.Component {
  state = {
    name: '',
    username: '',
    password: ''
  }

  componentDidMount() {
    this.props.closeAlert()
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render() {
    return (
      <div className="login-page">
        <div className="login-form">
          {this.props.alert ? (
           <div class="ui error message">
             <i class="close icon" onClick={this.props.closeAlert}></i>
             <div class="header">{this.props.alert}</div>
           </div>
            )
            :
            null
          }
          <Form onSubmit={(event) => this.props.handleSignupSubmit(event, this.state, this.props.routerProps.history)}>
            <Form.Field>
              <label>Name</label>
              <input placeholder='Name' name="name" onChange={this.handleChange} />
            </Form.Field>
            <Form.Field>
              <label>Username</label>
              <input placeholder='Username' name="username" onChange={this.handleChange} />
            </Form.Field>
            <Form.Field>
              <label>Password</label>
              <input placeholder='Password' name="password" type="password" onChange={this.handleChange} />
            </Form.Field>
            <Button type='submit'>Sign Up</Button>
          </Form>
        </div>
        <Map parent="form" />
      </div>
    )
  }
}

function msp(state) {
  return {
    alert: state.user.alert
  }
}

export default connect(msp, {
  handleSignupSubmit,
  closeAlert
})(SignupForm);
