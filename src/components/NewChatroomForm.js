import React from 'react';
import { API_ROOT, HEADERS } from '../constants'

class NewChatroomForm extends React.Component {
  state = {
    title: ''
  };

  handleChange = e => {
    this.setState({ title: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault()
    fetch(`${API_ROOT}/chatrooms`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(this.state)
    });
    this.setState({ title: '' });
  };

  render = () => {
    return (
      <div className="NewChatroomForm">
        <form onSubmit={this.handleSubmit}>
          <label>New Chatroom:</label>
          <br />
          <input
            type="text"
            value={this.state.title}
            onChange={this.handleChange}
          />
          <input type="submit" />
        </form>
      </div>
    );
  };
}

export default NewChatroomForm;
