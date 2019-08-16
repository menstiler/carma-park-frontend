import React from 'react'
import { connect } from 'react-redux'
import { handleSignupSubmit } from '../actions'

class SignupForm extends React.Component {
  state = {
    name: '',
    username: '',
    password: ''
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render() {
    return (
      <form onSubmit={(event) => this.props.handleSignupSubmit(event, this.state, this.props.routerProps.history)}>
        <label>Name:</label><input type="text" name="name" placeholder="name" onChange={this.handleChange} />
        <label>Username:</label><input type="text" name="username" placeholder="username"  onChange={this.handleChange} />
        <label>Password:</label><input type="password" name="password" placeholder="password"  onChange={this.handleChange} />
        <input type="submit" value="Sign Up" />
      </form>
    )
  }
}

function msp(state) {
  return {

  }
}

export default connect(msp, {
  handleSignupSubmit
})(SignupForm);
