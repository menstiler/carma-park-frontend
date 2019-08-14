import React from 'react';
import { connect } from 'react-redux'

import { API_ROOT, HEADERS } from '../constants'


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

    fetch(`${API_ROOT}/messages`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(this.state)
    });
    this.setState({ content: '' });
  };

  render = () => {
    return (
      <div className="newMessageForm">
        <form onSubmit={this.handleSubmit}>
          <label>New Message:</label>
          <br />
          <input
            type="text"
            value={this.state.content}
            onChange={this.handleChange}
          />
          <input type="submit" />
        </form>
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
