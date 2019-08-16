import React from 'react'
import { connect } from 'react-redux'
import { handleLoginSubmit } from '../actions'
import Map from './Map'

class LoginForm extends React.Component {
  state = {
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
      <>
        <form onSubmit={(event) => this.props.handleLoginSubmit(event, this.state, this.props.routerProps.history)}>
          <input type="text" name="username" onChange={this.handleChange} />
          <input type="password" name="password" onChange={this.handleChange} />
          <input type="submit" value="Login" />
        </form>
        <Map />
      </>
    )
  }
}

function msp(state) {
  return {
  }
}

export default connect(msp, {
  handleLoginSubmit
})(LoginForm);
