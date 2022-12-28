import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import { Form, Button, Input } from 'semantic-ui-react'
import { API, HEADERS } from '../constants'


const NewMessageForm = (props) => {
  const [content, setContent] = useState('')
  const [chatroomId, setChatroomId] = useState(props.chatroom_id)
  const [userId, setUserId] = useState(props.currentUser.id)

  useEffect(() => {
    setChatroomId(props.chatroom_id);
  }, [])

  const handleChange = e => {
    setContent(e.target.value);
  };
  
  const handleSubmit = e => {
    e.preventDefault();
    fetch(`${API}/messages`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({ content, chatroom_id: chatroomId, user_id: userId })
    });
    setContent('');
  };

  return (
    <div className="message-form">
      <Form onSubmit={handleSubmit}  >
        <Form.Field>
          <Input
          label={<Button type="submit">Send</Button>}
          labelPosition='right'
          value={content}
          onChange={handleChange}
          />
        </Form.Field>
      </Form>
    </div>
  );
}

function msp(state) {
  return {
    currentUser: state.user.currentUser,
  }
}

export default connect(msp, {
})(NewMessageForm);
