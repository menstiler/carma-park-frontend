import React from 'react';
import { connect } from 'react-redux'
import { Form, Button, Input } from 'semantic-ui-react'
import { API, HEADERS } from '../constants'


class NewMessageForm extends React.Component {
  state = {
    content: '',
    chatroom_id: this.props.chatroom_id,
    user_id: this.props.currentUser
  };

  componentWillReceiveProps = nextProps => {
    this.setState({ chatroom_id: nextProps.chatroom_id });
  };

  handleChange = e => {
    this.setState({ content: e.target.value });
  };
  
  handleSubmit = e => {
    e.preventDefault();
    fetch(`${API}/messages`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(this.state)
    });
    this.setState({ content: '' });
  };

  render = () => {
    return (
      <div className="message-form">
        <Form onSubmit={this.handleSubmit}  >
          <Form.Field>
            <Input
            label={<Button type="submit">Send</Button>}
            labelPosition='right'
            value={this.state.content}
            onChange={this.handleChange}
            />
          </Form.Field>
        </Form>
      </div>
    );
  };
}

function msp(state) {
  return {
    currentUser: state.user.currentUser,
  }
}

export default connect(msp, {
})(NewMessageForm);
