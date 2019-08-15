import React from 'react'
import { connect } from 'react-redux'
import { handleLoginSubmit } from '../actions'

class Login extends React.Component {
  state = {
    username: ''
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render() {
    return (
      <form onSubmit={(event) => this.props.handleLoginSubmit(event, this.state)}>
        <input type="text" name="username" onChange={this.handleChange} />
        <input type="submit" value="Login" />
      </form>
    )
  }
}

function msp(state) {
  return {

  }
}

export default connect(msp, {
  handleLoginSubmit
})(Login);
