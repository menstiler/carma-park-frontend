import React from 'react'
import { connect } from 'react-redux'
import { handleLoginSubmit, closeAlert } from '../actions'
import { Button, Form } from 'semantic-ui-react'
import Map from './Map'

class LoginForm extends React.Component {

  state = {
    username: '',
    password: '',
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
        <div className="form-container">
          <div class="main-title">carma park</div>
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
            <Form onSubmit={(event) => this.props.handleLoginSubmit(event, this.state, this.props.routerProps.history)}>
              <Form.Field>
                <label>Username</label>
                <input placeholder='Username' name="username" onChange={this.handleChange} />
              </Form.Field>
              <Form.Field>
                <label>Password</label>
                <input placeholder='Password' name="password" type="password" onChange={this.handleChange} />
              </Form.Field>
              <Button type='submit'>Login</Button>
            </Form>
          </div>
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
  handleLoginSubmit,
  closeAlert
})(LoginForm);
