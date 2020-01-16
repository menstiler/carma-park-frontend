import React from 'react'
import { connect } from 'react-redux'
import { handleLoginSubmit, closeAlert } from '../actions/actions'
import { Button, Form, Modal, Header } from 'semantic-ui-react'
import Map from './Map'
import '../styles/loginPage.scss';
import {
  NODE_ENV as inDevelopment
} from '../constants';

class LoginForm extends React.Component {

  state = {
    username: '',
    password: '',
    modelOpen: true
  }

  handleDone = () => {
    this.setState({
      modelOpen: false
    })
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
          <div className="main-title">carma park</div>
          <div className="login-form">
            {this.props.alert ? (
             <div className="ui error message">
               <i className="close icon" onClick={this.props.closeAlert}></i>
               <div className="header">{this.props.alert}</div>
             </div>
              )
              :
              null
            }
            { 
              inDevelopment === "production"
              ? 
                <Modal
                  onClose={this.handleDone}
                  open={this.state.modelOpen}
                >
                  <Header icon='car' content='Welcome!' />
                  <Modal.Content>
                    <p>
                      Hi! Welcome to Carma Park, Feel free to sign up, or login with the test account:<br/>
                      Username: test<br/>
                      Password: test
                    </p>
                  </Modal.Content>
                  <Modal.Actions>
                  <Button color='green' onClick={this.handleDone} inverted>
                    Continue
                  </Button>
                </Modal.Actions>
                </Modal>
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
